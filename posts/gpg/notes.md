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

# Step 1: Setup dependencies

Start off with the crown jewel: gpg.
Feature-wise, the `gpg` and `gpg2` packages are very similiar.
They both have up-to-date security patches and both actively maintained.
Straight from `man`'s mouth, `gpg2` is better suited to desktop use.
Plus, there was one step in here that gpg can't do as easily.
One drawback is that zsh completions do not automatically kick in for `gpg2`.

Optional, but I am using the [Z Shell](http://www.zsh.org/) with [Sorin Ionescu's prezto](https://github.com/sorin-ionescu/prezto).
Nothing about the other software we use _requires_ that you use zsh.
But, there is an excellent [GPG script](https://github.com/sorin-ionescu/prezto/blob/master/modules/gpg/init.zsh) that simplifies a lot of the hassle of environment variables.
I know this script can easily be ported to a normal zsh script for users of
oh-my-zsh, and I imagine it is also rewritable to satisfy Bash.

In my `.zshrc`, I have the following directives:

```
# make it less tempting to use different versions of gpg
alias gpg=gpg2
# some options are slightly different/non-existant in gpg...be warned
compdef gpg2=gpg
```

We need to compile the [ykpersonalize](https://github.com/Yubico/yubikey-personalization) tool to change the mode from the default.
The `README.adoc` file is pretty spot on, but the gist is

```bash
# side note, is there a reason nobody uses the `apt` command?
# it's the best!
sudo apt install libyubikey-dev pkg-config libusb-1.0.0-dev git
git clone git://github.com/Yubico/yubikey-personalization.git
cd yubikey-personalization
autoreconf --install
./configure
sudo make check install
# note, this step is important to avoid the error
# ykinfo: error while loading shared libraries: libykpers-1.so.1: cannot open shared object file
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
but because it is the flags `0x2 | 0x80` which means that we want to enable
OTP mode, CCID (smartcard) mode, and use the `MODE_FLAG_EJECT` flag.
You could probably also choose `-m81` or `-m86` if you felt like it (check `man ykpersonlize` to decide which mode is best for you).

```bash
# nb, this removes ubuntu-gnome-desktop which removes software-center
# if you need these (I seem to get by fine without), this step is probably not necessary
sudo apt remove gnome-keyring
# http://www.bootc.net/archives/2013/06/09/my-perfect-gnupg-ssh-agent-setup/
# ^^^ This is amazing ^^^
# If you're running into problems
sudo rm -f /etc/xdg/autostart/gnome-keyring-{gpg,ssh}.desktop
sudo rm -f /usr/share/upstart/sessions/gpg-agent.conf
# Now, the last one or two here might not be necessary
# But dealing with this shit is super annoying, so eh better safe than sorry
sudo apt install gnupg2 gnupg-agent gpgsm pcscd libccid
```

```bash
# http://askubuntu.com/questions/20783/how-is-the-tmp-directory-cleaned-up
# TMPTIME=0 to clear on reboot
sudo vim /etc/default/rcS

ldconfig -p | grep libpcsclite.so
sudo ln -s /lib/x86_64-linux-gnu/libpcsclite.so.1 /usr/lib/libpcsclite.so
gpgconf --check-programs
```

#. NEO: Enable the Correct Device Mode

#. GPG: Generate a public/private key pair, subkeys, revocation

http://spin.atomicobject.com/2013/11/24/secure-gpg-keys-guide/

#. GPG: Backup in at least two places

* If lose Yubikey
* If lose private key
* If close to expire
* If lose laptop
http://www.jabberwocky.com/software/paperkey/

#. ALL: Double check restoration procedures
https://www.yubico.com/2014/06/lost-yubikey-practices/

#. GPG: Distribute public key

https://help.riseup.net/en/security/message-security/openpgp/best-practices#use-the-sks-keyserver-pool-instead-of-one-specific-server-with-secure-connections

#. Ubuntu: Setup the correct udev rules

https://blog.habets.se/2013/02/GPG-and-SSH-with-Yubikey-NEO
There is a procedure for doing this in the yubikey-personalization repository, but the easier way / a way that I could actually get working is a little simpler and comes via [Thomas Habets's Blog](https://blog.habets.se/2013/02/GPG-and-SSH-with-Yubikey-NEO).
Namely, we create a file `/etc/udev/rules.d/99-yubikey.rules` to look like

```udevrules
cd /etc/udev/rules.d
sudo vim 99-yubikey.rules
SUBSYSTEM=="usb", ATTR{idVendor}=="1050", ATTR{idProduct}=="0111", OWNER="oychang"
```

The first three parts are boolean conditions on the device we plugin (these are constants that map to the Yubikey NEO and the last part is the operation to execute for the device.
You can verify this yourself with `dmesg | tail` after plugging in the Yubikey, or some other arcane unix utility.


Note, I think using the plural words as in the blog will also work.


#. Ubuntu: Disable gnome-keyring, gpg-agent, ssh-agent from startup

If
- `$SSH_AUTH_SOCK`
- `$GPG_AGENT_INFO`

are set, this is a problem

#. Ubuntu: Enable ZSH Plugins

Add a `gpg` line to your `~/.zpreztorc`.
Given you keep the defaults, it should look a little like

```bash
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

cd ~/Code/password-store && sudo make install
sudo apt install pwgen xclip autoconf
sudo cp src/completion/pass.zsh-completion /usr/local/share/zsh/site-functions/_pass

#. Add OTP through the computer

Android apps are shit.
They are effectively read-only.

ykpersonalize -1 -o oath-hotp
sudo apt-get install pcscd python-pyscard python-pbkdf2 python-pyside.qtgui
