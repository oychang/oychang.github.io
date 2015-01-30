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
# Setting up a Yubikey NEO for HOTP and SSH on Ubuntu and Android

`16 January 2015 -- Oliver Chang`

Facts:
    * want to be able to use as 2nd unclock pass <http://www.passwordstore.org/>
    http://en.wikipedia.org/wiki/YubiKey
    * want to use instead of Google Authenticator as HOTP
    http://en.wikipedia.org/wiki/HMAC-based_One-time_Password_Algorithm
    * want to use as 2nd factor for SSH passwords
    * mobily, want to tap and use NFC
        * should hold passwords

What happens if I lose my YubiKey?

If you are using your YubiKey with a service and/or application, the policy for lost or stolen YubiKeys depends on how the service/application deals with the situation.

The simplest is if the site supports alternative authentication mechanisms, so that you can regain access to the account and can de-associate the lost YubiKey from your account, and associate your new YubiKey to the account.

For example, the LastPass Premium subscription allows users to configure up to 5 YubiKeys with a LastPass account, so they can continue to log in using other keys if one is lost. Read more about it here.

If you cannot regain access, typical sites have an authentication credential recovery mechanism. You would use that to regain access to your account, and to dissociate the YubiKey and then re-associate it again.

Applications/services may also provide other mechanisms for users/administrators to assign a new YubiKey in the case the user lost his/her original key. Please inquire directly to applications or services supporting the YubiKey on their policies.

Please see also our blog post on this topic.

https://www.yubico.com/2014/06/lost-yubikey-practices/

* Have to assume manufacturer safety...

Viewed as a keyboard device...no drivers required!
You can test this by opening a text editor and tapping the gold key
http://demo.yubico.com/start/otp/neo
flashing green light every three seconds


Most wants can be setup through using the YubiKey as an OpenPGP smart card
https://www.yubico.com/2012/12/yubikey-neo-openpgp/

http://finninday.net/wiki/index.php/Yubikey#install_yubikey_utilities_and_libraries
On Ubuntu, download

download both
    tar.gz and tar.gz.sig
    https://launchpad.net/+help-registry/verify-downloads.html
    http://www.cyberciti.biz/tips/howto-verify-integrity-of-the-tar-balls-with-gpg-command.html
    in short,
        my gpg is already setup from using pass...ymmv
        probably have to do some init voodoo

        --- Downloads/chrome » gpg --decrypt ykpers-1.16.0.tar.gz.sig
        gpg: Signature made Fri 26 Sep 2014 03:47:22 AM EDT using RSA key ID B2168C0A
        gpg: Can't check signature: public key not found

        http://explainshell.com/explain?cmd=gpg+--fingerprint

        --- Downloads/chrome » gpg --keyserver pgpkeys.mit.edu --recv-key B2168C0A
        gpg: requesting key B2168C0A from hkp server pgpkeys.mit.edu
        gpg: key B2168C0A: public key "Klas Lindfors <klas@yubico.com>" imported
        gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
        gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
        gpg: Total number processed: 1
        gpg:               imported: 1  (RSA: 1)

        http://explainshell.com/explain?cmd=gpg+--fingerprint
        --- Downloads/chrome » gpg --fingerprint B2168C0A
        pub   2048R/B2168C0A 2013-11-29 [expires: 2015-05-19]
              Key fingerprint = 0A3B 0262 BCA1 7053 07D5  FF06 BCA0 0FD4 B216 8C0A
        uid                  Klas Lindfors <klas@yubico.com>
        sub   2048R/561F9ECF 2013-11-29 [expires: 2015-05-19]
        sub   2048R/233B994C 2013-11-29 [expires: 2015-05-19]

        date of pgp is not suspicious

        https://www.yubico.com/about/team/
        Senior Software Developer
        https://launchpad.net/~klali
        OpenPGP keys: 9D1C0E79, B2168C0A
        https://launchpad.net/~yubico/+archive/ubuntu/stable
        https://github.com/Yubico
        listed under people
        http://pgpkeys.mit.edu/pks/lookup?op=vindex&search=0xBCA00FD4B2168C0A
        https://github.com/Yubico/yubikey-personalization/blob/master/Makefile.am

        can assume that this key is valid

        --- Downloads/chrome » gpg --verify ykpers-1.16.0.tar.gz.sig ykpers-1.16.0.tar.gz
        gpg: Signature made Fri 26 Sep 2014 03:47:22 AM EDT using RSA key ID B2168C0A
        gpg: Good signature from "Klas Lindfors <klas@yubico.com>"
        gpg: WARNING: This key is not certified with a trusted signature!
        gpg:          There is no indication that the signature belongs to the owner.
        Primary key fingerprint: 0A3B 0262 BCA1 7053 07D5  FF06 BCA0 0FD4 B216 8C0A

        --- Downloads/chrome » gpg --lsign-key B2168C0A

        pub  2048R/B2168C0A  created: 2013-11-29  expires: 2015-05-19  usage: SC
                             trust: unknown       validity: unknown
        sub  2048R/561F9ECF  created: 2013-11-29  expires: 2015-05-19  usage: E
        sub  2048R/233B994C  created: 2013-11-29  expires: 2015-05-19  usage: A
        [ unknown] (1). Klas Lindfors <klas@yubico.com>


        pub  2048R/B2168C0A  created: 2013-11-29  expires: 2015-05-19  usage: SC
                             trust: unknown       validity: unknown
         Primary key fingerprint: 0A3B 0262 BCA1 7053 07D5  FF06 BCA0 0FD4 B216 8C0A

             Klas Lindfors <klas@yubico.com>

        This key is due to expire on 2015-05-19.
        Are you sure that you want to sign this key with your
        key "Oliver Chang <oliver@oychang.com>" (FBBC4501)

        The signature will be marked as non-exportable.

        Really sign? (y/N) y

        You need a passphrase to unlock the secret key for
        user: "Oliver Chang <oliver@oychang.com>"
        2048-bit RSA key, ID FBBC4501, created 2014-12-09


        --- Downloads/chrome » gpg --verify ykpers-1.16.0.tar.gz.sig ykpers-1.16.0.tar.gz
        gpg: Signature made Fri 26 Sep 2014 03:47:22 AM EDT using RSA key ID B2168C0A
        gpg: checking the trustdb
        gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
        gpg: depth: 0  valid:   1  signed:   1  trust: 0-, 0q, 0n, 0m, 0f, 1u
        gpg: depth: 1  valid:   1  signed:   0  trust: 1-, 0q, 0n, 0m, 0f, 0u
        gpg: next trustdb check due at 2015-05-19
        gpg: Good signature from "Klas Lindfors <klas@yubico.com>"


sudo apt-get install libyubikey-dev libusb-1.0-0-dev libjson0-dev
http://yubico.github.io/yubikey-personalization/releases.html
untar
cd, ./configure
sudo make check install

ykinfo: error while loading shared libraries: libykpers-1.so.1: cannot open shared object file: No such file or directory

sudo ldconfig
ykpersonalize -m82
reboot key

sudo gpg --card-edit

--- Downloads/chrome » sudo gpg --card-edit
[sudo] password for ochang:
gpg: WARNING: unsafe ownership on configuration file `/home/ochang/.gnupg/gpg.conf'

because running as root, even though

--- Downloads/chrome » ls -ld /home/ochang/.gnupg && ls -l /home/ochang/.gnupg/gpg.conf
drwx------ 2 ochang ochang 4096 Jan 15 20:22 /home/ochang/.gnupg
-rw------- 1 ochang ochang 9398 Feb  3  2013 /home/ochang/.gnupg/gpg.conf

ctrl d to exit

pwd
    /home/ochang/.password-store
find . -name '*.gpg' -exec gpg --batch --quiet --output {}.txt --decrypt {} \;
mkdir ~/export
find -name '*.gpg.txt' -exec cp --target-directory=/home/ochang/export {} +
cd ~/export && ls
rm -rf ~/.password-store
# delete all (secret) keys
rm -rf ~/.gnupg

sudo apt-get install gnupg-agent

https://wiki.archlinux.org/index.php/GnuPG
personal-digest-preferences SHA512
cert-digest-algo SHA512
default-preference-list SHA512 SHA384 SHA256 SHA224 AES256 AES192 AES CAST5 ZLIB BZIP2 ZIP Uncompressed
personal-cipher-preferences TWOFISH CAMELLIA256 AES 3DES

https://wiki.archlinux.org/index.php/GnuPG
http://spin.atomicobject.com/2013/11/24/secure-gpg-keys-guide/
https://we.riseup.net/riseuplabs+paow/openpgp-best-practices

--- udev/rules.d » gpg --expert --edit-key oliver@oychang.com
Secret key is available.

pub  4096R/212554DF  created: 2015-01-16  expires: 2017-01-15  usage: C
                     trust: ultimate      validity: ultimate
sub  2048R/7253FCFE  created: 2015-01-16  expires: 2016-01-16  usage: S
sub  2048R/97C99385  created: 2015-01-16  expires: 2016-01-16  usage: E
sub  2048R/4AEAE370  created: 2015-01-16  expires: 2016-01-16  usage: A
[ultimate] (1). Oliver Chang <oliver@oychang.com>
[ultimate] (2)  Oliver Chang <o.chang@umiami.edu>

gpg> %


https://konklone.com/post/get-a-fido-key-right-now-and-log-into-stuff-with-it#getting-it-working-on-linux


--- udev/rules.d » pwd
/etc/udev/rules.d
--- udev/rules.d » cat 70-yubikey.rules
ACTION!="add|change", GOTO="u2f_end"

KERNEL=="hidraw*", SUBSYSTEM=="hidraw", ATTRS{idVendor}=="1050", ATTRS{idProduct}=="0111", TAG+="uaccess"
SUBSYSTEM=="usb", ATTRS{idVendor}=="1050", ATTRS{idProduct}=="0111", TAG+="uaccess"

LABEL="u2f_end"


http://www.jabberwocky.com/software/paperkey/
 gpg --recv-key A1BC4FA4
10047  gpg --verify paperkey-1.3.tar.gz.sig paperkey-1.3.tar.gz
10048  untar paperkey-1.3.tar.gz
10050  cd paperkey-1.3
10052  vim README
10053* lpr
10054* man lpr
10056  ./configure
10057  vim config.s
10058  vim config.status
10059  make check
10060  make install
10061  sudo make install
10063  paperkey
10064  man paperkey

--- udev/rules.d » cat 70-yubikey.rules
ACTION!="add|change", GOTO="u2f_end"

KERNEL=="hidraw*", SUBSYSTEM=="hidraw", ATTRS{idVendor}=="1050", ATTRS{idProduct}=="0111", TAG+="uaccess"
SUBSYSTEM=="usb", ATTRS{idVendor}=="1050", ATTRS{idProduct}=="0111", TAG+="uaccess"

LABEL="u2f_end"
--- udev/rules.d » sudo tune2fs -l /dev/mapper/ubuntu-root | grep acl
[sudo] password for ochang:
Default mount options:    user_xattr acl
--- udev/rules.d » df -h
Filesystem               Size  Used Avail Use% Mounted on
/dev/mapper/ubuntu-root  455G  382G   50G  89% /
none                     4.0K     0  4.0K   0% /sys/fs/cgroup
udev                     5.8G  4.0K  5.8G   1% /dev
tmpfs                    1.2G  1.3M  1.2G   1% /run
none                     5.0M     0  5.0M   0% /run/lock
none                     5.9G  4.6M  5.9G   1% /run/shm
none                     100M   44K  100M   1% /run/user
/dev/sda1                228M   81M  135M  38% /boot
/home/ochang/.Private    455G  382G   50G  89% /home/ochang

--- udev/rules.d » lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 14.04.1 LTS
Release:    14.04
Codename:   trusty

--- udev/rules.d » gpg --change-pin

8 chars
1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code

not use paperkey

sudo apt-get install gpg2
sudo apt-get install libccid pcscd scdaemon libksba8
http://blog.josefsson.org/2014/06/23/offline-gnupg-master-key-and-subkeys-on-yubikey-neo-smartcard/
https://developers.yubico.com/ykneo-openpgp/KeyImport.html

url, use an http

gpg/card> fetch
gpg: requesting key 7253FCFE from https server oychang.com
gpgkeys: protocol `https' not supported
gpg: no handler for keyserver scheme `https'


http://www.bootc.net/archives/2013/06/09/my-perfect-gnupg-ssh-agent-setup/
--- ~/Desktop » echo $SSH_AUTH_SOCK
/tmp/gpg-ach2mj/S.gpg-agent.ssh


ykpersonalize -1 -o oath-hotp


https://developers.yubico.com/yubioath-desktop/
sudo apt-get install pcscd python-pyscard python-pbkdf2 python-pyside.qtgui

