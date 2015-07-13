---
title: An Accurate Guide to Yubikey GPG Wizardry
---

<div id="subheader">
[Home](https://oychang.com/) --
<time datetime="2015-07-13">July 13, 2015</time> --
[Suggest Edits](https://github.com/oychang/oychang.github.io/tree/master/posts/gpg/notes-on-yubikey-neo.md)
</div>

<script type="text/javascript">
(function () {
  'use strict';
  var DURATION = 6;
  var heading = document.getElementById("header").children[0];
  var title = heading.textContent;
  var hueChange = Math.floor(360 / title.length);

  heading.innerText = "";
  var newHTML = "";
  for (var i in title) {
    var c = title[i];
    var delay = (DURATION * ((i * hueChange) % 360) / 360) - DURATION + 's';
    var attrs = [
      'color: hsl(' + (i * hueChange) + ', 100%, 50%)',
      'animation-delay: ' + delay,
      '-webkit-animation-delay: ' + delay,
      '-moz-animation-delay: ' + delay,
      '-o-animation-delay: ' + delay,
    ];
    attrs = attrs.join(";");

    newHTML += '<span style="' + attrs + '">' + c + '</span>';
  }
  heading.innerHTML = newHTML;

})();
</script>

<div class="content">
<div class="banana section r-img-inline">

# Introduction

![Size Comparison of Various Hardware Tokens; own work; [CC BY 4.0]( https://creativecommons.org/licenses/by/4.0/)](images/size_comparison.png)

The [Yubikey NEO](https://www.yubico.com/products/yubikey-hardware/yubikey-neo/) is a key-sized device that provides an additional "multi-factor" level of security to normal passwords that can be accessed via USB or <acronym title="Near Field Communication">NFC</acronym>, as well as a powerful embedded <acronym title="GNU Privacy Guard">GPG</acronym> SmartCard for use with the <acronym title="Pretty Good Privacy">PGP</acronym> system of public-key cryptography.

Pictured above are two alternatives to the hardware token approach to multifactor authentication.
To use multifactor authentication the process is generally to require a second prompt after putting in your password that requires you to type in the [time-based one-time password](https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm) that the token spits out.

The most common implementation of <acronym title="Time-based One-Time Password">TOTP</acronym>, [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2), isn't even pictured--it's implemented in software rather than hardware, the tradeoff being you trust the Authenticator code and Android system to be secure instead of carrying around a token for each site you care about (tokens are _not_ small).
Hence the allure of the NEO: the TOTP data is stored and calculated on the key and you only have to trust the device you use to read the code for independent thirty second intervals.

The NEO is probably the most featureful hardware token you can buy: it is small, supports Windows, Mac, Linux, Android, <acronym title="Fast IDentity Online Universal 2nd Factor">FIDO U2F</acronym>, One-Time Passwords, HMAC-based One-Time Passwords, Time-based One-Time Passwords, HMAC-SHA1 Challange-Response, OpenPGP, Static Passwords, and SmartCards.
This page describes the terrible, horrible, no good, very painful setup process for modern versions of the GPG SmartCard on Ubuntu and applications in SSH Authentication, File Storage, and OTP.

##### Asides

How is the TOTP implemented?
  ~ The NEO does not contain a power source. You need a Python application on a computer or an Yubico Android application to read the TOTP. [From Yubico,](http://www.yubico.com/wp-content/uploads/2014/02/Yubico-TOTP-Setup.pdf) the high-level description is to use "a Challenge/Response configuration to the YubiKey in HMAC-SHA1 mode using the shared OATH secret from the site or service to be secured. The helper app (YubiTOTP) passes the current system time as a challenge to the YubiKey and processes the response as per the OATH specification to generate a 6 or 8 digit OATH-TOTP code."

Could TOTP data be stolen by as you walk around?
  ~ Yes, but unlikely. The token stores the label and secret and those can be accessed from any device without authentication. In practice on a Moto X and Nexus 7, you need to memorize the location of the NFC antenna and align both the antenna the key to read the TOTPs. To steal data surreptitiously at distance would require [an infeasibly large antenna.](http://physics.stackexchange.com/questions/44037/why-is-near-field-communication-nfc-range-limited-to-about-20cm) To steal a TOTP code in-person by picking the NEO up off of a desk would be trivially easy.

Are they durable?
  ~ Surprisingly so! The 7-month year old NEO pictured above usually dangles off of a laptop port on a keychain sporting maybe a half-dozen keys while not in-pocket or plugged into an exposed motorcycle keyhole in rainy Florida.

</div>

<!-- *********************************************************************** -->

<div class="winter-forest section">

# Effectiveness

![[Battle of the Bulge](https://en.wikipedia.org/wiki/File:Battle_of_the_Bulge.jpg); public domain](images/bulge.jpg)

If 20th century France was anything at all like Imperial Japan, the obituaries of May 1940 would likely include the seppuku of André Maginot, champion of the "impenetrable" Maginot Line.
(Though on the plus side there would be far more samurai in classic French cinema.)
I imagine the Yubikey as similar: it definitely makes you less vulnerable to certain password attacks (common), but it is not a panacea because there are innumerable other vulnerabilities if you're a target ranging from improper use in practice like leaving the key around to software vulnerabilities to [Van Eck phreaking](https://en.wikipedia.org/wiki/Van_Eck_phreaking).

Software vulnerabilities are not a hypothetical.
In March 2011, RSA SecurID hardware tokens were found to be vulnerable because of a [phishing attack at the company.](https://en.wikipedia.org/wiki/RSA_SecurID#March_2011_system_compromise)
In April 2015, the Yubikey [ykneo-openpgp](https://github.com/Yubico/ykneo-openpgp) software was found to be [vulnerable](https://developers.yubico.com/ykneo-openpgp/SecurityAdvisory%202015-04-14.html) to a [memory leak in OpenSSL.](https://developers.yubico.com/ykneo-openpgp/SecurityAdvisory%202015-04-14.html)


https://ssd.eff.org/en/module/introduction-threat-modeling
https://www.schneier.com/blog/archives/2015/06/why_we_encrypt.html
https://news.ycombinator.com/item?id=9550094

> If you look at security from economic terms, it's a trade-off.
> Every time you get some security, you're always trading off something.
> You're going to trade off something, either money or time, convenience, capabilities, maybe fundamental liberties.
> And the question to ask when you look at a security anything is not whether this makes us safer, but whether it's worth the trade-off.
> - [Bruce Schneier, _The security image_](https://www.ted.com/talks/bruce_schneier/transcript?language=en)

I like to **recreationally paranoid**

##### Asides

Yubikey NEO vulnerability
  ~ You should perform the test in the Yubico security advisory to find out if you're vulnerable and request a free replacement with the updated software. While admittedly unlikely to be an issue in the wild, if you're going to do something you may as well do it right. Worst case scenario you give Yubico your address and get to give a free NEO to somebody else.

What about biometric/SMS/<insert other security method>?
  ~ I prefer the security and relative ease-of-use of the NEO. Everybody feels differently, and Bonneau et al in [The Quest to Replace Passwords (PDF)](http://research.microsoft.com/pubs/161585/QuestToReplacePasswords.pdf) have devised an [excellent table to quantify the pros and cons](images/authentication-tradeoffs-table.png) of different methods.

</div>

<!-- *********************************************************************** -->

<div class="turda section r-img-inline">

# Into the Crevasse

![[Salina Turda by Cosmin Danila](https://commons.wikimedia.org/wiki/File:Salina_Turda_045.jpg); [CC BY-SA 3.0 RO](https://creativecommons.org/licenses/by-sa/3.0/ro/deed.en) ](images/salina_turda.jpg)

[Yubico Guide ]: https://www.yubico.com/2012/12/yubikey-neo-openpgp/ "Yubikey NEO and OpenPGP"

## Something Pretty Good

PGP is the [de facto](http://blog.cryptographyengineering.com/2014/08/whats-matter-with-pgp.html) method of storing data at rest which we will use to store passwords via the excellent [password store](http://www.passwordstore.org/). So now we have a system where to login you need three things: (a) the public key, (b) the private key (and the encryption subkey...more on this later), and (c) the passphrase to unlock the the keychain. The Neo is great because it holds onto (b) and (c) while requiring a short, impossible to brute-force PIN to unlock. In addition to encryption, we can also use PGP for authentication, which we will use to securely SSH with the same PIN.

## Setup

The setup process is not for the faint of heart. There are active [bugs](https://bugs.launchpad.net/ubuntu/+source/gnome-keyring/+bug/884856) that make it far less than a plug-and-play experience on Ubuntu. But if you've made it this far you're at least [recreationally paranoid](https://xkcd.com/1181/) enough to know your way around a command line. Here are some specifics about my setup, but there should be no hardware quirks since the Yubikey looks like two things to the OS: a CCID device and a USB keyboard.

- Laptop: 2012 Thinkpad T520
- Device: [Yubikey NEO](https://www.yubico.com/products/yubikey-hardware/yubikey-neo/)
- Operating System: Ubuntu/Xubuntu 14.04/14.10
- Shell: [Z Shell](http://www.zsh.org/) with [prezto](https://github.com/sorin-ionescu/prezto)

### Step 1: Setup GPG

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

### Step 2: Setup your public and private GPG keys

This step of the process is actually very well-documented elsewhere online. [My favorite guide](http://spin.atomicobject.com/2013/11/24/secure-gpg-keys-guide/) is by Mike English from Atomic Object because he describes the rationale behind the subkey architecture and where the security in the scheme comes from. Note that when you generate your keys the maximum length they can be for the Neo is 2048-bits. Yubico has their reasoning [here](https://www.yubico.com/2015/02/big-debate-2048-4096-yubicos-stand/), but the gist is that 4096-bit keys are future proofing for a future in which Elliptic Curves Cryptography (ECC) exists, so why isn't the hypothetical future you using ECC.
Another great resource is this [Best Practices guide](https://help.riseup.net/en/security/message-security/openpgp/best-practices) from riseup that goes into some good advice for distributing your public key.

After the setup and before even considering the Yubikey, think about the various things that might go wrong with the encrpytion scheme and make appropriate backups of your private keys. Here are some things to kick off your paranoid fantasies:

- If you lose the Yubikey: HOTP codes need to be manually reset, need to use private key backups, consider revocation if the normal PIN is obvious or if the Admin PIN (which can reset a lockout) is obvious
- If you lose private key or revocation: need to revoke...consider implications on data already encrypted
- If close to expiration date: need to move date forward or regenerate (what are the implications on encrypted data?)
- If you lose laptop with key stubs on it
- If you lose any one of the backups

### Step 3: Setup the Yubikey NEO

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

### Step 4: Setup the SmartCard Utilities

```bash
# nb, this removes ubuntu-gnome-desktop which removes software-center
# if you need these (I seem to get by fine without), this step is probably not necessary
$ sudo apt remove gnome-keyring
# Now, the last one or two here might not be necessary...YMMV
$ sudo apt install gnupg2 gnupg-agent gpgsm pcscd libccid
```

### Step 5: Setup Configurations

This step is the most infuriating, bar none, because here Ubuntu actively fights you with tight integration with gnome-keyring and automatically starting versions of gpg-agent and ssh-agent which will wittle away your will to even exist. The best explanation for what to do here comes from [Chris Boot's guide to a perfect setup](http://www.bootc.net/archives/2013/06/09/my-perfect-gnupg-ssh-agent-setup/).

There are a two main goals we have here. First is to get the SmartCard to work correctly. We will know when this is done because `gpg2 --card-status` will print out a bunch of details instead of an error. After that milestone, the goal is to load a gpg identity onto the card (covered in Mike English's guide), and run `ssh-add -l` and see something. At that point we are golden like a basket of fries or maybe Pony Boy.

First we set up the device to have the correct permissions. If `sudo gpg2 --card-status` works for you but `gpg2 --card-status` does not, you are probably missing this step. I think the ever helpful `gpg: selecting openpgp failed: ec=6.108` error is also a consequence of this (if not, you might need to [change the SmartCard driver](https://wiki.archlinux.org/index.php?title=GnuPG&oldid=367867#GnuPG_together_with_OpenSC)).
The procedure for doing this in the yubikey-personalization repository never worked for me, so the way that I could actually get working is a little simpler and comes via [Thomas Habets's Blog](https://blog.habets.se/2013/02/GPG-and-SSH-with-Yubikey-NEO):

```bash
# Setup udev rules file.
# These idVendor and idProduct tags are customized to the Yubikey NEO. Every donggggle has the same unique ids.
# NB Habets's blog uses ATTRS rather than ATTR...both are fine I guess?
$ cat /etc/udev/rules.d/99-yubikey.rules
SUBSYSTEM=="usb", ATTR{idVendor}=="1050", ATTR{idProduct}=="0111", OWNER="oychang"
```

Next, we set up `gpg2` and `gpg-agent`. The process of doing this is supposed to be very easy, but Ubuntu gets in the way. If you delete the `.conf` and `.desktop` files and a `ps aux | grep gpg-agent` or `ssh-agent` show up with results, you have more configuration files to hunt down and exterminate.

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

# To verify most things are there.
# dirmngr is optional but hey it don't hurt
$ gpgconf --check-programs
```

After a reboot, enable the `gpg` plugin for Prezto. It's nothing too fancy (see code [here](https://github.com/sorin-ionescu/prezto/blob/master/modules/gpg/init.zsh)), but it is pretty much bulletproof so if you're having problems you can almost always eliminate problems setting environmental variables and other terrible things.

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

`ssh-add -l` should work now. If it doesn't try these steps:

1. Ensure you have the SmartCard with your private subkeys and your computer has your public key. `gpg2 --card-status` should look like a mini-dossier.
2. You might _need_ to have stubs instead of full keys. When you run `gpg2 -K`, you should see `ssb>`, not `ssb`
3. Really, the hard part here is removing `gnome-keyring` and all of the configuration files for `gpg-agent` and `ssh-agent`
4. The [ArchWiki GnuPG](https://wiki.archlinux.org/index.php/GnuPG) page is invaluable for commands you can use to poke different parts of the setup to isolate your problem
5. Restart computer maybe?

## Optional Utilities

Now, the setup is over! Here are some justifications for why you spent a week setting up GPG:

1. [pass](http://www.passwordstore.org/) is great for managing passwords. It's pretty much just a bash script that creates `.gpg` files for your individual passwords that you can edit in `vim` or `emacs` to add more details. There are negative sides to this approach like the website names being unencrypted, as well as `history` potentially showing what websites you use the most.
2. SSH authentication via public key is super easy. `ssh-agent` takes care of converting your GPG authentication key into a form for use with ssh. So you just add the output of `ssh-add -L` to the remote machine's `~/.ssh/authorized_hosts`, and magic happens! If you use git with ssh, you get authenticated pushes and pulls as well.
3. HOTP codes. The system here is not great. You need to get Yubico's python applet for your PC and a pretty poorly designed (visually only, I hope) Yubico app for your phone. And then, you can only write new accounts (of which there can thankfully be many) via USB. And also, you need to awkwardly search for where to tap the donggggle on your mobile device since the NFC antenna is so small. And at the end of the day, it really feels like putting all your eggs in one basket, so the effectiveness with gpg is mediocre.

</div>

<!-- *********************************************************************** -->

<div class="xkcd section">

# Conclusion

![[XKCD #1811 by Randall Munroe](https://xkcd.com/1181/); [CC BY-NC 2.5]( https://creativecommons.org/licenses/by-nc/2.5/); "If you want to be extra safe, check that there's a big block of jumbled characters at the bottom."](images/pgp_xkcd.png)

Hopefully there were some helpful tips in this ramble. If you have your setup going (especially the public keystore part), try emailing me with <https://oychang.com/oychang.gpg> so we can start work on the chapter of our technically accurate Snowden/Greenwald slash fiction where they setup gpg.

#### Asides

- The code for the technicolor header comes from <http://stackoverflow.com/questions/19165364> with modifications to run even when not hovered and convert a text block to individual `<span>`s
- Dominant image colors extracted using [color-thief](http://lokeshdhakar.com/projects/color-thief/)

</div>
</div>
