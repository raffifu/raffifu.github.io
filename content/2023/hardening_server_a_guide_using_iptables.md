title=Hardening Server - A guide using iptables
description=The most generic way to setup an firewall on linux
date=2023-08-13
type=post
status=published
~~~~~~
The basic concept of hardening a server is thinking about the possible “way” how an attacker can access our server. Often, an attacker will scan our server to find an open port or simply use a common port such as ssh, http, ftp, etc. When the port is accessible the attacker can launch a bot to bruteforce the password or to find vulnerability on the server. Hardening means an effort to protect a server by making it more difficult for bot/attacker to do their action.
As an administrator, restricting the open port on the network is one example of hardening action. On linux, `iptables` is the generic way to filter the connection. But, There’s other option using `ufw` or `firewalld` (in fact that application interacts with `iptables`). The concept of `iptables` is chaining the rule like the image below
![chaining](https://github.com/raffifu/raffifu.github.io/assets/22138274/effd91fa-67aa-4ad2-9487-c3a6d0b703e2)

>  "Iptables diagram" by SUPRIYO BISWAS is licensed under CC BY-SA 4.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-sa/4.0/?ref=openverse. 

For simplicity, this article will not dive deep into the concept of `iptables`. But, we’ll focus on the **INPUT** and **OUTPUT** chain. Let’s think about the **INPUT** chain is the rules for every connection going to our server and **OUTPUT** chain is the rules for every connection going out from our server. We’ll try to drop every incoming connection except for SSH in port 22. Make sure you have access to the command line via SSH for implementing this action.
# List all of rules applied
To see if our command is correctly applied, we can use the following command to list all rules on all chain
![iptables -L command to list all rules](https://github.com/raffifu/raffifu.github.io/assets/22138274/16ea9ca4-704f-4e53-b986-86f6ddd433da)
# Allow SSH in port 22
Before going to **DROP** every connection, we must allow SSH to ensure we still can have access if something goes wrong. To allow the SSH connection we can use the following command:
![command iptables to add ssh rules](https://github.com/raffifu/raffifu.github.io/assets/22138274/dd413a08-02dd-410d-aa08-c5eaba89b1c4)

`-A` means we’ll append the rules into **INPUT** chain with `-p` protocol tcp and will `-m` match tcp connection with `--dport` destination port 22. If all the rules match, `iptables` must `-j` jump to **ACCEPT** the traffic.
# **DROP** everything
Now, we’ll drop every connection going to our server. Be aware, if something goes wrong you’ll lose the connection to the server.
![drop connection](https://github.com/raffifu/raffifu.github.io/assets/22138274/5229be48-22db-47b6-a97c-2398264bcb07)

`-P` means we’ll change the policy in the **INPUT** chain to “**DROP**”. So every single connection that didn’t match the rules will be dropped/blocked.
# Check the configuration
We can try to send an ICMP packet (ping) to the server. If the server didn’t respond, it means our configuration is correct.
![test ping from other machine](https://github.com/raffifu/raffifu.github.io/assets/22138274/b645f52f-5a6a-4446-a37e-7f128c897c44)
Screenshot above is trying to ping server ip address from another machine. It didn't response that means the `iptables` configuration is correct

# But wait, can you receive any response from HTTP/DNS service?
Yup, you can’t. The reason is because currently the server only allows incoming traffic targeting port 22. The other service like HTTP/DNS response can’t go through our server because it is blocked by `iptables`. To solve this issue, we need to added rules that allow the incoming traffic when the connection is **RELATED** or **ESTABLISHED**
![troubleshooting](https://github.com/raffifu/raffifu.github.io/assets/22138274/41f6e3cd-7390-4548-a7cd-ce67dcda3bdc)
The command will add a rules that tell the `iptables` to allow a traffic if the state of the connection is **ESTABLISHED** or **RELATED**
That’s the end of the article, so far we use `iptables` to only allow incoming SSH traffic through our server. We can also, trying to block every **OUTPUT** conection. If you are interested to learn more about `iptables`. You can use the following resources:
https://linux.die.net/man/8/iptables
