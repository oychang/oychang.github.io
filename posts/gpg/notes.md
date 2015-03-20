% Yubikey for Fun and Profit
% Oliver Chang
% 19 March 2015

What do you get when Ubuntu, the [Yubikey NEO](https://www.yubico.com/products/yubikey-hardware/yubikey-neo/), and GPG walk into a bar?
You get a barfight because fundamentally none of them want to work together.

The Yubikey NEO is a great $60 keychain widget for the recreationally paranoid.
It implements a hardware [security token](https://en.wikipedia.org/wiki/Security_token) which offers two-factor authentication like Google Authenticator or SMS one-time codes.

Positives:
- GPG is defacto method of storing data at rest
- Impossible to brute force
- Cryptographic operations happen on the Yubikey
- Easiest way to use GPG

Here are some example use cases:
* SSH Logins: Plugin the NEO, type a PIN, and get authentication thorugh gpg-agent
* Easier GPG Encryption: Instead of typing a long and complicated (well, hopefully), insert the NEO, type a PIN, and be done with it
* OTP Codes: get OTP codes on any device with NFC or USB
* Password management: via password-store and gpg, unlock a password store
<http://www.passwordstore.org/>

Now, there are a lot of great posts online about the gpg setup procedure.
I'm going to go into the hair-pullingly frustrating parts of the software setup.

Thinkpad T520, 2012 Vintage
Yubikey NEO purchased on Amazon
Ubuntu/Xubuntu 14.04/14.10

#. Ubuntu/GPG: Setup dependencies

#. NEO: Enable the Correct Device Mode

#. GPG: Generate a public/private key pair

#. GPG: Generate subkeys, revocation certificates

#. GPG: Backup in at least two places

#. ALL: Double check restoration procedures
https://www.yubico.com/2014/06/lost-yubikey-practices/

#. GPG: Distribute public key

#. Ubuntu: Setup the correct udev rules
/etc/udev/rc.d/99-yubikey.rules

#. Ubuntu: Disable gnome-keyring, gpg-agent, ssh-agent from startup

#. Ubuntu: Enable ZSH Plugins
.oh-my-zsh/custom/gpg/gpg.plugin.zsh

===============================================================================

Viewed as a keyboard device...no drivers required!

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

#. Install gnupg2
#. Install zsh, prezto, enable gpg module
#. `gpg: WARNING: The GNOME keyring manager hijacked the GnuPG agent.`
#. https://wiki.archlinux.org/index.php/GNOME_Keyring#Disable_keyring_daemon
#. gpgconf && install gpgsm
	* http://www.grant-olson.net/news/2013/03/09/using-openpgp-smartcard-on-ubuntu-12-10.html
	* scdaemon[3722]: PC/SC OPEN failed: no service (0x8010001d)
#. add 99-yubikey.rules
#. ldconfig -p | grep libpcsclite.so
	#. sudo ln -s /lib/x86_64-linux-gnu/libpcsclite.so.1 /usr/lib/libpcsclite.so
#. sudo apt remove gnome-keyring
	#. will remove software center
* please apt install gnupg2
* cd ~/Code/password-store && please make install
* please cp src/completion/pass.zsh-completion /usr/local/share/zsh/site-functions/_pass
* sudo apt remove gnome-keyring
* gpg: selecting openpgp failed: Card error
gpg: OpenPGP card not available: Card error
*   177  vim gnome-keyring-ssh.desktop
  178  vim gnome-keyring-gpg.desktop
  179  pwd
  180  gpg --card-status
  181  la
  182  gpg-agent --daemon
  183  pkill gpg-agent
  184  eval $(gpg-agent --daemon)
  185  ls
  188  sudo apt install pcscd
  189  ls /tmp
  190  gpg2 --card-status
  192  man history
  193  man -k history
* apt-cache rdepends gnome-keyring
* apt-cache rdepends ubuntu-gnome-desktop -> software-center
