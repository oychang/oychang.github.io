% GPG with a Yubikey
% Oliver Chang
% 29 January 2015

# Test

0. Free (as in beer) software
1. Setup PGP using best practices
2. Store website passwords with 2fa
3. Use SSH with 2fa
4. Portably sync 2fa codes between the computer and any number of devices


Android, Ubuntu, PGP, SSH
GPG
Upfront cost, $60

philosophy: probably not completely secure
slow down* Subkeys

* Expiration

* Public, private key

* In case of loss of... laptop, yubikey
    * No password required for HOTP codes

* Distribute public key!

* Revocation certificate!

```python
[x for x in xrange(20)]
set([f for f in xrange(20) if f == 'f'])
```

```
.oh-my-zsh/custom/gpg/gpg.plugin.zsh
/etc/udev/rc.d/99-yubikey.rules
```

Probably not a huge deal!
