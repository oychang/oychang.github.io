**Problem**: Remembering passwords is a huge pain in the ass but a requirement to not have all your money stolen

**Solution**: [2-Factor Authentication (2FA)](https://en.wikipedia.org/wiki/Multi-factor_authentication) means you can keep using your birthday (June 4, 1994 at Tampa General Hospital for me, if you also want to take a shot at going through the backdoor of asinine "Security Questions") as your password while you get to keep all your money.

2FA works reasonably well for most non-Snowdens by generating unique, short PIN codes that come in many forms like text messages, [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2), or RSA Tokens. However, this approach involves trusting that all the systems involved in delivering the text message to you (cell towers, server, internet pipes, phone hardware, OS manufacturer, text messaging apps), or the code of Google Authenticator (open source, but hard to tell if what you see in code is what you get on Google Play), or the companies who made the keys in the first place (RSA [scandalously failed](https://en.wikipedia.org/wiki/RSA_SecurID#March_2011_system_compromise) on this count).

Bruce Schneier, a cryptogropher whose claim to fame is having a hard-to-spell last name, promulgates the idea that security is not a dichotomy, but a spectrum that becomes more of a pain-in-the-ass the further right you go:

> If you look at security from economic terms, it's a trade-off.
> Every time you get some security, you're always trading off something.
> You're going to trade off something, either money or time, convenience, capabilities, maybe fundamental liberties.
> And the question to ask when you look at a security anything is not whether this makes us safer, but whether it's worth the trade-off.
> - [Bruce Schneier, _The security image_](https://www.ted.com/talks/bruce_schneier/transcript?language=en) (trigger warning: TED talk)

To quantify this, Bonneau et al in [The Quest to Replace Passwords (PDF)](http://research.microsoft.com/pubs/161585/QuestToReplacePasswords.pdf) devised this table to compare various schemes against the historical gold standard.

![Compare and Contrast of Ease-of-Use in Authentication](https://raw.githubusercontent.com/oychang/oychang.github.io/master/posts/gpg/authentication-tradeoffs-table.png)

The whole spectrum is represented here, most of the suspects familiar. Facebook Connect is what you use on websites to Just Get It To Work without remembering a different password. But who would trust Facebook Connect with their banking login? 

Biometric authentication? Cool in spy movies where they do the thing with the eye and the voice and sometimes the eye stealing thing, cool in the iPhone, but generally a [dangerously insecure](http://arstechnica.com/apple/2013/09/chaos-computer-club-hackers-trick-apples-touchid-security-feature/) pain in the ass.

Then, the most green cells occur in multifactor authentication schemes. We'll setup a Yubikey NEO of the clan Hardware Tokens for the rest of this article. 

# Something Pretty Good

The [Neo](https://www.yubico.com/products/yubikey-hardware/yubikey-neo/), the chosen one, is the Bentley of hardware tokens. It is a dongle that connects via USB, has HOTP via NFC on your phone or USB (an arguably more secure flavor than Google Authenticator since the codes are stored on the Neo), [FIDO U2F](https://fidoalliance.org/about/overview/) ([see: gushing praise](https://konklone.com/post/get-a-fido-key-right-now-and-log-into-stuff-with-it)), and most importantly a programmable SmartCard (more specifically, a [Common Criteria, JavaCard element](https://lwn.net/Articles/618888/)). The SmartCard is important because it means all cryptography operations happen on the actual donggle on a chip slathered with resin.

The SmartCard allows us to use a [Pretty Good Privacy (PGP)](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) public key/private key system. The belle of the PGP implementation ball is GPG, widely available and considered very reliable. PGP is the [de facto](http://blog.cryptographyengineering.com/2014/08/whats-matter-with-pgp.html) method of storing data at rest which we will use to store passwords via the excellent [password store](http://www.passwordstore.org/). So now we have a system where to login you need three things: (a) the public key, (b) the private key (and the encryption subkey...more on this later), and (c) the passphrase to unlock the the keychain. The Neo is great because it holds onto (b) and (c) while requiring a short, impossible to brute-force PIN to unlock. In addition to encryption, we can also use PGP for authentication, which we will use to securely SSH with the same PIN.

# Setup

The setup process is not for the faint of heart. There are active [bugs](https://bugs.launchpad.net/ubuntu/+source/gnome-keyring/+bug/884856) that make it far less than a plug-and-play experience on Ubuntu. But if you've made it this far you're at least [recreationally paranoid](https://xkcd.com/1181/) enough to know your way around a command line. Here are some specifics about my setup, but there should be no hardware quirks since the Yubikey looks like two things to the OS: a CCID device and a USB keyboard.

- Laptop: 2012 Thinkpad T520
- Device: [Yubikey NEO](https://www.yubico.com/products/yubikey-hardware/yubikey-neo/)
- Operating System: Ubuntu/Xubuntu 14.04/14.10
- Shell: [Z Shell](http://www.zsh.org/) with [prezto](https://github.com/sorin-ionescu/prezto)

# Step 1: Setup GPG

Start off with the crown jewel: gpg.
Feature-wise, the `gpg` and `gpg2` packages are very similiar.
They both have up-to-date security patches and both actively maintained.
But straight from `man`'s mouth, `gpg2` is better suited to desktop use.

```bash
# side note, is there a reason nobody uses the `apt` command?
# it's the best!
sudo apt install gnupg2
```

One drawback to using `gpg2` is that ZSH tab completions do not automatically kick in.
Add the following lines to your `.zshrc` to easily fix this travesty.

```bash
$ cat ~/.zshrc
...
# make it less tempting to use different versions of gpg
alias gpg=gpg2
# some options are slightly different/non-existant in gpg...be warned
compdef gpg2=gpg
...
```

Nothing about the other software we use _requires_ that you use zsh.
But, there is an **excellent** [GPG script](https://github.com/sorin-ionescu/prezto/blob/master/modules/gpg/init.zsh) that simplifies so much of the pain.
This script can easily be ported to a normal zsh script for users of oh-my-zsh, and I imagine it is also rewritable for Bash pretty easily.

# Step 2: Setup your public and private GPG keys

This step of the process is actually very well-documented elsewhere online. [My favorite guide](http://spin.atomicobject.com/2013/11/24/secure-gpg-keys-guide/) is by Mike English from Atomic Object because he describes the rationale behind the subkey architecture and where the security in the scheme comes from. Another great resource is this [Best Practices guide](https://help.riseup.net/en/security/message-security/openpgp/best-practices) from riseup that goes into some good advice for distributing your public key. 

After the setup and before even considering the Yubikey, think about the various things that might go wrong with the encrpytion scheme and make appropriate backups of your private keys. Here are some things to kick off your paranoid fantasies:

- If you lose the Yubikey: HOTP codes need to be manually reset, need to use private key backups, consider revocation if the normal PIN is obvious or if the Admin PIN (which can reset a lockout) is obvious
- If you lose private key or revocation: need to revoke...consider implications on data already encrypted
- If close to expiration date: need to move date forward or regenerate (what are the implications on encrypted data?)
- If you lose laptop with key stubs on it
- If you lose any one of the backups

# Step 3: Setup the Yubikey NEO

We need to compile the [ykpersonalize](https://github.com/Yubico/yubikey-personalization) tool to change the mode on the dongggle from the default cool demo mode to HOTP+CCID mode.
The `README.adoc` file is pretty spot on, but the gist is

```bash
sudo apt install libyubikey-dev pkg-config libusb-1.0.0-dev git
git clone git://github.com/Yubico/yubikey-personalization.git
cd yubikey-personalization
autoreconf --install
./configure
sudo make check install
# note, this step is important to avoid the error
# "ykinfo: error while loading shared libraries: libykpers-1.so.1: cannot open shared object file"
sudo ldconfig
# If this does not work, two possibilities:
#   1) Device did not connect properly...check `dmesg | tail` for something like
# [37818.368240] usb 2-1.2: New USB device found, idVendor=1050, idProduct=0111
# [37818.368252] usb 2-1.2: New USB device strings: Mfr=1, Product=2, SerialNumber=0
# [37818.368259] usb 2-1.2: Product: Yubikey NEO OTP+CCID
#   2) The current user cannot access the device. Either run via `sudo` or check
#      the section below on udev rules.
ykpersonalize -m82
# now reboot the card (unplug and plug) to have the new mode kick in
```

We say `-m82` not because the year of the Falklands War is critical to hardware tokens,
but because it is the binary OR of the flags `0x2 | 0x80` which means that we want to enable
OTP mode, CCID (smartcard) mode, and use the `MODE_FLAG_EJECT` flag.
You could probably also choose `-m81` or `-m86` if you felt like it (check `man ykpersonlize` to decide which mode is best for you).

# Step 4: Setup the SmartCard Utilities

```bash
# nb, this removes ubuntu-gnome-desktop which removes software-center
# if you need these (I seem to get by fine without), this step is probably not necessary
$ sudo apt remove gnome-keyring
# Now, the last one or two here might not be necessary...YMMV
$ sudo apt install gnupg2 gnupg-agent gpgsm pcscd libccid
```

# Step 5: Setup Configurations

http://www.bootc.net/archives/2013/06/09/my-perfect-gnupg-ssh-agent-setup/

```bash
$ cat ~/.gnupg/gpg.conf
...
use-agent
...

$ cat ~/.gnupg/gpg-agent.conf
...
enable-ssh-support
...

$ sudo rm -f /etc/xdg/autostart/gnome-keyring-{gpg,ssh}.desktop
# NB: This file gets recreated when there is an update to gpg-agent!
$ sudo rm -f /usr/share/upstart/sessions/gpg-agent.conf
# to be safe, I like to clear all of the agent files in /tmp on reboot
# just in case anything goes wrong
$ cat /etc/default/rcS
...
TMPTIME=0
...

# 
$ gpgconf --check-programs
```

There is a procedure for doing this in the yubikey-personalization repository, but the easier way / a way that I could actually get working is a little simpler and comes via [Thomas Habets's Blog](https://blog.habets.se/2013/02/GPG-and-SSH-with-Yubikey-NEO).
Namely, we create a file `/etc/udev/rules.d/99-yubikey.rules` to look like

```udevrules
$ cd /etc/udev/rules.d
$ cat 99-yubikey.rules
...
SUBSYSTEM=="usb", ATTR{idVendor}=="1050", ATTR{idProduct}=="0111", OWNER="oychang"
...
```

The first three parts are boolean conditions on the device we plugin (these are constants that map to the Yubikey NEO and the last part is the operation to execute for the device.
You can verify this yourself with `dmesg | tail` after plugging in the Yubikey, or some other arcane unix utility.
Note, I think using the plural words as in the blog will also work.

```bash
$ cat ~/.zpreztorc
...
# Set the Prezto modules to load (browse modules).
# The order matters.
zstyle ':prezto:load' pmodule \
  'environment' \
  'terminal' \
  'editor' \
  'history' \
  'directory' \
  'spectrum' \
  'utility' \
  'completion' \
  'prompt' \
  'gpg'
...
```

# Optional Utilities

cd ~/Code/password-store && sudo make install
sudo apt install pwgen xclip autoconf
sudo cp src/completion/pass.zsh-completion /usr/local/share/zsh/site-functions/_pass

Android apps are shit.
They are effectively read-only.

ykpersonalize -1 -o oath-hotp
sudo apt-get install pcscd python-pyscard python-pbkdf2 python-pyside.qtgui
