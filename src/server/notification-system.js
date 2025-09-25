const http = require('http');
const https = require('https');
const fs = require('fs');

/**
 * Advanced Notification and Alerting System
 * Handles deployment success/failure notifications, monitoring alerts, and integration with external systems
 */

// Configuration
const NOTIFICATION_CONFIG = {
    channels: {
        webhook: {
            enabled: !!process.env.NOTIFICATION_WEBHOOK_URL,
            url: process.env.NOTIFICATION_WEBHOOK_URL,
            timeout: 10000
        },
        email: {
            enabled: false, // Can be enabled with SMTP configuration
            smtp: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                user: process.env.SMTP_USER,
                password: process.env.SMTP_PASSWORD
            },
            from: process.env.NOTIFICATION_FROM_EMAIL || 'noreply@renekris.dev',
            to: process.env.NOTIFICATION_TO_EMAIL?.split(',') || []
        },
        slack: {
            enabled: !!process.env.SLACK_WEBHOOK_URL,
            webhookUrl: process.env.SLACK_WEBHOOK_URL,
            channel: process.env.SLACK_CHANNEL || '#deployments',
            username: 'Deployment Bot'
        },
        discord: {
            enabled: !!process.env.DISCORD_WEBHOOK_URL,
            webhookUrl: process.env.DISCORD_WEBHOOK_URL
        }
    },
    retries: 3,
    retryDelay: 5000,
    queueFile: '/tmp/notification-queue.json'
};

// Notification queue and state
let notificationQueue = [];
let isProcessingQueue = false;

/**
 * Load notification queue from disk
 */
function loadNotificationQueue() {
    try {
        if (fs.existsSync(NOTIFICATION_CONFIG.queueFile)) {
            const data = fs.readFileSync(NOTIFICATION_CONFIG.queueFile, 'utf8');
            notificationQueue = JSON.parse(data);
            console.log(`Loaded ${notificationQueue.length} pending notifications from queue`);
        }
    } catch (error) {
        console.warn('Failed to load notification queue:', error.message);
        notificationQueue = [];
    }
}

/**
 * Save notification queue to disk
 */
function saveNotificationQueue() {
    try {
        fs.writeFileSync(NOTIFICATION_CONFIG.queueFile, JSON.stringify(notificationQueue, null, 2));
    } catch (error) {
        console.warn('Failed to save notification queue:', error.message);
    }
}

/**
 * Generate notification content based on event type
 */
function generateNotificationContent(event) {
    const timestamp = new Date().toISOString();
    const environment = process.env.NODE_ENV || 'development';

    switch (event.type) {
        case 'deployment_success':
            return {
                title: `✅ Deployment Successful - ${environment}`,
                message: `Deployment ${event.deploymentId} completed successfully`,
                color: 'good',
                fields: [
                    { name: 'Environment', value: environment, inline: true },
                    { name: 'Version', value: event.version || 'unknown', inline: true },
                    { name: 'Duration', value: `${Math.round(event.duration / 1000)}s`, inline: true },
                    { name: 'Image Tag', value: event.imageTag || 'unknown', inline: true },
                    { name: 'Actor', value: event.actor || 'unknown', inline: true },
                    { name: 'Branch', value: event.branch || 'unknown', inline: true }
                ],
                timestamp
            };

        case 'deployment_failure':
            return {
                title: `❌ Deployment Failed - ${environment}`,
                message: `Deployment ${event.deploymentId} failed: ${event.reason}`,
                color: 'danger',
                fields: [
                    { name: 'Environment', value: environment, inline: true },
                    { name: 'Failure Reason', value: event.reason, inline: false },
                    { name: 'Duration', value: `${Math.round(event.duration / 1000)}s`, inline: true },
                    { name: 'Actor', value: event.actor || 'unknown', inline: true },
                    { name: 'Branch', value: event.branch || 'unknown', inline: true }
                ],
                timestamp
            };

        case 'rollback_triggered':
            return {
                title: `🔄 Rollback Triggered - ${environment}`,
                message: `Automatic rollback initiated for deployment ${event.deploymentId}`,
                color: 'warning',
                fields: [
                    { name: 'Environment', value: environment, inline: true },
                    { name: 'Trigger Reason', value: event.reason, inline: false },
                    { name: 'Details', value: event.details, inline: false },
                    { name: 'Failed Deployment', value: event.deploymentId, inline: true }
                ],
                timestamp
            };

        case 'health_check_failure':
            return {
                title: `🚨 Health Check Failure - ${environment}`,
                message: `Health check failed: ${event.endpoint}`,
                color: 'danger',
                fields: [
                    { name: 'Environment', value: environment, inline: true },
                    { name: 'Endpoint', value: event.endpoint, inline: true },
                    { name: 'Error', value: event.error, inline: false },
                    { name: 'Response Time', value: `${event.responseTime}ms`, inline: true }
                ],
                timestamp
            };

        case 'performance_degradation':
            return {
                title: `⚠️ Performance Degradation - ${environment}`,
                message: `Performance metrics exceed thresholds`,
                color: 'warning',
                fields: [
                    { name: 'Environment', value: environment, inline: true },
                    { name: 'Metric', value: event.metric, inline: true },
                    { name: 'Current Value', value: event.currentValue, inline: true },
                    { name: 'Threshold', value: event.threshold, inline: true }
                ],
                timestamp
            };

        case 'service_recovery':
            return {
                title: `✅ Service Recovery - ${environment}`,
                message: `Service has recovered from issues`,
                color: 'good',
                fields: [
                    { name: 'Environment', value: environment, inline: true },
                    { name: 'Recovery Time', value: `${Math.round(event.recoveryTime / 1000)}s`, inline: true },
                    { name: 'Previous Issue', value: event.previousIssue, inline: false }
                ],
                timestamp
            };

        default:
            return {
                title: `📢 System Notification - ${environment}`,
                message: event.message || 'System notification',
                color: 'neutral',
                fields: [
                    { name: 'Environment', value: environment, inline: true },
                    { name: 'Event Type', value: event.type, inline: true }
                ],
                timestamp
            };
    }
}

/**
 * Send webhook notification
 */
async function sendWebhookNotification(content, retryCount = 0) {
    if (!NOTIFICATION_CONFIG.channels.webhook.enabled) {
        return { success: false, reason: 'Webhook not configured' };
    }

    return new Promise((resolve) => {
        const postData = JSON.stringify({
            text: content.title,
            attachments: [{
                color: content.color,
                title: content.title,
                text: content.message,
                fields: content.fields,
                timestamp: content.timestamp,
                footer: 'Renekris Infrastructure'
            }]
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: NOTIFICATION_CONFIG.channels.webhook.timeout
        };

        const protocol = NOTIFICATION_CONFIG.channels.webhook.url.startsWith('https:') ? https : http;

        const req = protocol.request(NOTIFICATION_CONFIG.channels.webhook.url, options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true, statusCode: res.statusCode });
                } else {
                    console.error(`Webhook notification failed: ${res.statusCode} - ${responseData}`);
                    resolve({ success: false, statusCode: res.statusCode, response: responseData });
                }
            });
        });

        req.on('error', (error) => {
            console.error('Webhook notification error:', error.message);
            resolve({ success: false, error: error.message });
        });

        req.on('timeout', () => {
            req.destroy();
            console.error('Webhook notification timeout');
            resolve({ success: false, error: 'Request timeout' });
        });

        req.write(postData);
        req.end();
    });
}

/**
 * Send Slack notification
 */
async function sendSlackNotification(content) {
    if (!NOTIFICATION_CONFIG.channels.slack.enabled) {
        return { success: false, reason: 'Slack not configured' };
    }

    const slackPayload = {
        channel: NOTIFICATION_CONFIG.channels.slack.channel,
        username: NOTIFICATION_CONFIG.channels.slack.username,
        icon_emoji: content.color === 'good' ? ':white_check_mark:' :
                   content.color === 'danger' ? ':x:' :
                   content.color === 'warning' ? ':warning:' : ':information_source:',
        attachments: [{
            color: content.color,
            title: content.title,
            text: content.message,
            fields: content.fields?.map(field => ({
                title: field.name,
                value: field.value,
                short: field.inline || false
            })),
            ts: Math.floor(new Date(content.timestamp).getTime() / 1000)
        }]
    };

    return new Promise((resolve) => {
        const postData = JSON.stringify(slackPayload);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 10000
        };

        const req = https.request(NOTIFICATION_CONFIG.channels.slack.webhookUrl, options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true, statusCode: res.statusCode });
                } else {
                    resolve({ success: false, statusCode: res.statusCode, response: responseData });
                }
            });
        });

        req.on('error', (error) => {
            resolve({ success: false, error: error.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ success: false, error: 'Request timeout' });
        });

        req.write(postData);
        req.end();
    });
}

/**
 * Send Discord notification
 */
async function sendDiscordNotification(content) {
    if (!NOTIFICATION_CONFIG.channels.discord.enabled) {
        return { success: false, reason: 'Discord not configured' };
    }

    const discordPayload = {
        embeds: [{
            title: content.title,
            description: content.message,
            color: content.color === 'good' ? 0x00ff00 :
                   content.color === 'danger' ? 0xff0000 :
                   content.color === 'warning' ? 0xffff00 : 0x0099ff,
            fields: content.fields,
            timestamp: content.timestamp,
            footer: {
                text: 'Renekris Infrastructure'
            }
        }]
    };

    return new Promise((resolve) => {
        const postData = JSON.stringify(discordPayload);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 10000
        };

        const req = https.request(NOTIFICATION_CONFIG.channels.discord.webhookUrl, options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true, statusCode: res.statusCode });
                } else {
                    resolve({ success: false, statusCode: res.statusCode, response: responseData });
                }
            });
        });

        req.on('error', (error) => {
            resolve({ success: false, error: error.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ success: false, error: 'Request timeout' });
        });

        req.write(postData);
        req.end();
    });
}

/**
 * Process notification queue
 */
async function processNotificationQueue() {
    if (isProcessingQueue || notificationQueue.length === 0) {
        return;
    }

    isProcessingQueue = true;

    while (notificationQueue.length > 0) {
        const notification = notificationQueue.shift();

        try {
            const content = generateNotificationContent(notification.event);
            const results = [];

            // Send to all configured channels
            if (NOTIFICATION_CONFIG.channels.webhook.enabled) {
                results.push(await sendWebhookNotification(content));
            }

            if (NOTIFICATION_CONFIG.channels.slack.enabled) {
                results.push(await sendSlackNotification(content));
            }

            if (NOTIFICATION_CONFIG.channels.discord.enabled) {
                results.push(await sendDiscordNotification(content));
            }

            // Check if any channel succeeded
            const anySuccess = results.some(result => result.success);

            if (!anySuccess && notification.retryCount < NOTIFICATION_CONFIG.retries) {
                // Re-queue for retry
                notification.retryCount = (notification.retryCount || 0) + 1;
                notification.nextRetry = Date.now() + NOTIFICATION_CONFIG.retryDelay;
                notificationQueue.push(notification);
                console.log(`Notification failed, will retry (attempt ${notification.retryCount}/${NOTIFICATION_CONFIG.retries})`);
            } else if (!anySuccess) {
                console.error('Notification failed after all retries:', notification.event.type);
            } else {
                console.log(`Notification sent successfully: ${notification.event.type}`);
            }

        } catch (error) {
            console.error('Error processing notification:', error);
        }

        // Small delay between notifications to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    isProcessingQueue = false;
    saveNotificationQueue();
}

/**
 * Queue notification for sending
 */
function queueNotification(event) {
    const notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        event,
        retryCount: 0
    };

    notificationQueue.push(notification);
    console.log(`Queued notification: ${event.type}`);

    // Process queue immediately
    setTimeout(processNotificationQueue, 100);

    return notification.id;
}

/**
 * Send deployment success notification
 */
function notifyDeploymentSuccess(deploymentData) {
    return queueNotification({
        type: 'deployment_success',
        ...deploymentData
    });
}

/**
 * Send deployment failure notification
 */
function notifyDeploymentFailure(deploymentData) {
    return queueNotification({
        type: 'deployment_failure',
        ...deploymentData
    });
}

/**
 * Send rollback notification
 */
function notifyRollbackTriggered(rollbackData) {
    return queueNotification({
        type: 'rollback_triggered',
        ...rollbackData
    });
}

/**
 * Send health check failure notification
 */
function notifyHealthCheckFailure(healthData) {
    return queueNotification({
        type: 'health_check_failure',
        ...healthData
    });
}

/**
 * Send performance degradation notification
 */
function notifyPerformanceDegradation(performanceData) {
    return queueNotification({
        type: 'performance_degradation',
        ...performanceData
    });
}

/**
 * Send service recovery notification
 */
function notifyServiceRecovery(recoveryData) {
    return queueNotification({
        type: 'service_recovery',
        ...recoveryData
    });
}

/**
 * Send custom notification
 */
function notifyCustom(eventType, data) {
    return queueNotification({
        type: eventType,
        ...data
    });
}

/**
 * Get notification statistics
 */
function getNotificationStats() {
    return {
        queueLength: notificationQueue.length,
        isProcessing: isProcessingQueue,
        configured: {
            webhook: NOTIFICATION_CONFIG.channels.webhook.enabled,
            slack: NOTIFICATION_CONFIG.channels.slack.enabled,
            discord: NOTIFICATION_CONFIG.channels.discord.enabled,
            email: NOTIFICATION_CONFIG.channels.email.enabled
        }
    };
}

/**
 * Initialize notification system
 */
function initializeNotificationSystem() {
    loadNotificationQueue();

    // Process queue periodically
    setInterval(processNotificationQueue, 30000); // Every 30 seconds

    console.log('Notification system initialized');
    console.log('Configured channels:', {
        webhook: NOTIFICATION_CONFIG.channels.webhook.enabled,
        slack: NOTIFICATION_CONFIG.channels.slack.enabled,
        discord: NOTIFICATION_CONFIG.channels.discord.enabled,
        email: NOTIFICATION_CONFIG.channels.email.enabled
    });
}

module.exports = {
    initializeNotificationSystem,
    notifyDeploymentSuccess,
    notifyDeploymentFailure,
    notifyRollbackTriggered,
    notifyHealthCheckFailure,
    notifyPerformanceDegradation,
    notifyServiceRecovery,
    notifyCustom,
    getNotificationStats,
    processNotificationQueue
};