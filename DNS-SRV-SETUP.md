# SRV Records Setup for Game Servers

## Cloudflare DNS SRV Records Configuration

Add these SRV records in Cloudflare DNS management:

### Minecraft Server (Port 25565)
```
Type: SRV
Name: _minecraft._tcp.renekris.dev
Service: _minecraft
Protocol: _tcp  
Priority: 0
Weight: 5
Port: 25565
Target: renekris.dev
TTL: Auto
```

### Tarkov SPT Server (Port 6969)
```
Type: SRV
Name: _tarkov._tcp.renekris.dev
Service: _tarkov
Protocol: _tcp
Priority: 0
Weight: 5  
Port: 6969
Target: renekris.dev
TTL: Auto
```

## How Players Connect

### Minecraft
Players can connect using just: `renekris.dev`
- Minecraft client will automatically query the SRV record
- Will resolve to renekris.dev:25565

### Tarkov SPT
Players can use: `renekris.dev` (application should support SRV lookup)
- Will resolve to renekris.dev:6969

## Traefik TCP Routing Update Needed

Update the tcp.yml to handle both game servers:

```yaml
tcp:
  routers:
    minecraft:
      rule: "HostSNI(`*`)"
      service: minecraft-service
      entryPoints:
        - minecraft
    tarkov:
      rule: "HostSNI(`*`)" 
      service: tarkov-service
      entryPoints:
        - tarkov

  services:
    minecraft-service:
      loadBalancer:
        servers:
          - address: "192.168.1.232:25565"
    tarkov-service:
      loadBalancer:
        servers:
          - address: "192.168.1.234:6969"
```