---
title: An Accurate Guide to Yubikey GPG Wizardry
---

<div id="subheader">
[Home](https://oychang.com/) --
<time datetime="2015-07-14">July 14, 2015</time> --
[Suggest Edits](https://github.com/oychang/oychang.github.io/tree/master/posts/gpg/notes-on-yubikey-neo.md)
</div>

<script type="text/javascript">
(function () {
  "use strict";
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
The codes in the picture are expired codes--it doesn't matter that you know them now since you can't reverse the shared secret that generated that key and you would need to know the normal password as well!

The most common implementation of <acronym title="Time-based One-Time Password">TOTP</acronym>, [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2), isn't even pictured--it's implemented in software rather than hardware, the tradeoff being you trust the Authenticator code and Android system to be secure instead of carrying around a token for each site you care about (tokens are _not_ small).
Hence the allure of the NEO: the TOTP data is stored and calculated on the key and you only have to trust the device you use to read the code for independent thirty second intervals.

The NEO is probably the most featureful hardware token you can buy: it is small, supports Windows, Mac, Linux, Android, <acronym title="Fast IDentity Online Universal 2nd Factor">FIDO U2F</acronym>, One-Time Passwords, HMAC-based One-Time Passwords, Time-based One-Time Passwords, HMAC-SHA1 Challange-Response, OpenPGP, Static Passwords, and SmartCards.
This page describes the **terrible, horrible, no good, very painful** Ubuntu setup process for SSH Authentication, File Storage, and OTP.

##### Notes

How is the TOTP implemented?
  ~ The NEO does not contain a power source. You need a Python application on a computer or an Yubico Android application to read the TOTP. [From Yubico,](http://www.yubico.com/wp-content/uploads/2014/02/Yubico-TOTP-Setup.pdf) the high-level description is to use "a Challenge/Response configuration to the YubiKey in HMAC-SHA1 mode using the shared OATH secret from the site or service to be secured. The helper app (YubiTOTP) passes the current system time as a challenge to the YubiKey and processes the response as per the OATH specification to generate a 6 or 8 digit OATH-TOTP code."

Could NFC TOTP data be stolen by as you walk around?
  ~ Extremely unlikely. The token stores the label and secret and those can be accessed from any device without authentication. In practice on a Moto X and Nexus 7, you need to memorize the location of the NFC antenna and align both the antenna the key to read the TOTPs. To steal data surreptitiously at distance would require [an infeasibly large antenna.](http://physics.stackexchange.com/questions/44037/why-is-near-field-communication-nfc-range-limited-to-about-20cm) To steal a TOTP code in-person by picking the NEO up off of a desk would be trivially easy.

Are they durable?
  ~ Surprisingly so! The 7-month year old NEO pictured above usually dangles off of a laptop port on a keychain sporting maybe a half-dozen keys while not in-pocket or plugged into an exposed motorcycle keyhole in rainy Florida.

</div>

<!-- *********************************************************************** -->

<div class="winter-forest section">

# Effectiveness

![[Battle of the Bulge](https://en.wikipedia.org/wiki/File:Battle_of_the_Bulge.jpg); public domain](images/bulge.jpg)

I imagine the Yubikey as similar to the Maginot Line in 1940: it definitely makes you less vulnerable to certain common attacks, but it is not a panacea.
There are innumerable vulnerabilities ranging from improper use of security in practice like leaving a key around to widespread software vulnerabilities to [Van Eck phreaking](https://en.wikipedia.org/wiki/Van_Eck_phreaking).

Software vulnerabilities in hardware tokens are not a hypothetical.
In March 2011, RSA SecurID hardware tokens were found to be vulnerable because of a [phishing attack at the company.](https://en.wikipedia.org/wiki/RSA_SecurID#March_2011_system_compromise)
In April 2015, the Yubikey [ykneo-openpgp](https://github.com/Yubico/ykneo-openpgp) software was found to be [vulnerable](https://developers.yubico.com/ykneo-openpgp/SecurityAdvisory%202015-04-14.html) to a [memory leak in OpenSSL.](https://developers.yubico.com/ykneo-openpgp/SecurityAdvisory%202015-04-14.html)

A ["threat model"](https://ssd.eff.org/en/module/introduction-threat-modeling) describes how much you care about your security and what steps you should take to ensure you keep your privacy.

> If you look at security from economic terms, it's a trade-off.
> Every time you get some security, you're always trading off something.
> You're going to trade off something, either money or time, convenience, capabilities, maybe fundamental liberties.
> -[Bruce Schneier, _The security image_](https://www.ted.com/talks/bruce_schneier/transcript?language=en)

Personally, the NEO is largely an exercise in being **recreationally paranoid**.
I am not a whistleblower; I do not own vast wealth; I do not have information that could endanger lives...by all accounts, I do not need such an aggressive model of security.
But I believe that encryption should be [ubiquitous, automatic, ](https://www.schneier.com/blog/archives/2015/06/why_we_encrypt.html) and highly encouraged, to which end I use as much encryption as often as is pragmatic.

##### Notes

Yubikey NEO vulnerability
  ~ You should perform the test in the Yubico security advisory to find out if you're vulnerable and request a free replacement with the updated software. While admittedly unlikely to be an issue in the wild, if you're going to do something you may as well do it right. Worst case scenario you give Yubico your address and get to give a free NEO to somebody else.

What about biometric/SMS/other security method?
  ~ I prefer the security and relative ease-of-use of the NEO. Everybody feels differently, and Bonneau et al in [The Quest to Replace Passwords (PDF)](http://research.microsoft.com/pubs/161585/QuestToReplacePasswords.pdf) have devised an [excellent table to quantify the pros and cons](images/authentication-tradeoffs-table.png) of different methods.

</div>

<!-- *********************************************************************** -->

<div class="turda section r-img-inline">

# Into the Crevasse

![[Salina Turda by Cosmin Danila](https://commons.wikimedia.org/wiki/File:Salina_Turda_045.jpg); [CC BY-SA 3.0 RO](https://creativecommons.org/licenses/by-sa/3.0/ro/deed.en) ](images/salina_turda.jpg)

Remember the part about this being a painful process?
The setup process will _at minimum_ take a few hours and there will probably something specific about your setup you will need to puzzle out.
GPG is a legendarily Byzantine tool; mix that with SmartCards, a dash of Linux drivers, and serve with `gnome-keyring` to get quite a [spicy](https://bugs.launchpad.net/ubuntu/+source/gnome-keyring/+bug/884856) meatball.
There is an official [Yubico Guide](https://www.yubico.com/2012/12/yubikey-neo-openpgp/), but it is almost three years old at this point and goes off the rails for my setup towards the end, but it is a good introduction.

There are four different parts to this process:

1. Setup PGP (Hard--well, mostly time consuming--but well documented)
2. Setup Yubikey with Ubuntu & Change Hardware Mode (Easy and well documented)
3. Setup Yubikey SmartCard (Hard and poorly documented)
4. Setup Applications to use PGP (Easy and relatively well documented)

I focus mainly on the third part.


## Step 1: Setup GPG

For reference this is my hardware setup, but I do not think there are specific quirks that make this setup important.

- Laptop: 2012 Thinkpad T520
- Device: 2015 Yubikey NEO
- Operating System: Tested with {Ubuntu, Xubuntu} {14.04, 14.10}
- Shell: [Z Shell](http://www.zsh.org/) with [prezto](https://github.com/sorin-ionescu/prezto)

### Install GPG2

Start by [installing GPG](https://www.gnupg.org/download/index.html).
On Ubuntu this is already done, but prefer to have the package `gnupg2`.
Both `gnupg` and `gnupg2` are actively maintained and are more-or-less identical (`gnupg2` has fewer commands AFAIK), but it's a little bit of a Python 3 situation here--you should use `gnupg2` as it is the way things are going forward and it is "better suited to desktop use".

```bash
# is there a reason nobody uses the `apt` command--it has colors
# the irony of using a tool described as "meant to be pleasant for end users"
# to install gpg is not lost on me
$ sudo apt install gnupg2
```

### Install ZSH, prezto, and setup .zshrc

Nothing about the other software we use _requires_ that you use the Z Shell.
But, there is an **absolutely, magnificently, fantastically excellent** [GPG script](https://github.com/sorin-ionescu/prezto/blob/master/modules/gpg/init.zsh) for `ZSH` with `prezto` that simplifies so much of the pain of using SmartCards.
This script can easily be ported to a normal `ZSH` script for users of `oh-my-zsh`.

One drawback to using `gpg2` is that ZSH tab completions do not exist.
You can fix this by pretending `gpg2` is `gpg`.

```bash
$ cat ~/.zshrc
...
# make it less tempting to use gpg version 1
alias gpg=gpg2
# use gpg's tab completions for gpg2; careful: not all options exist in both
compdef gpg2=gpg
...
$ cat ~/.zpreztorc
...
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

#### Notes

`gpg` is already installed in Ubuntu
  ~ If you're using `apt` or `apt-get` you're using the **authentication** part of GPG. On a `apt update && apt upgrade` you see that Ubuntu's repositories are served over `http://`. It doesn't matter if this connection is insecure (for authenticity purposes) since package integrity is verified by you with the PGP keys baked into Ubuntu and listed with `apt-key list`

Setting up GPG on an airgapped computer
  ~ The security of the PGP key generation step effects all things you do with that key. So, if you do it on an insecure computer this whole thing is moot. Thus, for super security it is advised to do this step on an airgapped computer. I did not do this, but this recent article by [Víctor Cuadrado Juan](http://viccuad.me/blog/secure-yourself-part-1-airgapped-computer-and-GPG-smartcards/) has some good pointers for airgapping and a neat wristband transportation idea.

### Setup your public and private GPG keys

This step of the process is very well-documented online.
[Mike English's guide](http://spin.atomicobject.com/2013/11/24/secure-gpg-keys-guide/) is my absolute favorite because he describes the rationale behind subkeys.
Note that when you generate your keys the maximum length they can be for the Neo is 2048-bits.
Yubico  [explains](https://www.yubico.com/2015/02/big-debate-2048-4096-yubicos-stand/), this is an intentional choice based on product price, processing speed, and pragmatic obsolescence since <acronym title="Elliptic Curves Cryptography">ECC</acronym> is where the future is, not arbitrarily large keys.

Another great resource is this [Riseup's Best Practices guide](https://help.riseup.net/en/security/message-security/openpgp/best-practices) that goes into some good advice for distributing your public key.
Also consider [Alex Cabal's guide](https://alexcabal.com/creating-the-perfect-gpg-keypair/) for an Ubuntu-specific guide.

### Check the Backups

Don't lock yourself out of your own house...make multiple backups and consider how things might fail.

- If you lose the Yubikey, you need to go reset your OTP schemes, revoke your subkeys, and make sure your Yubikey PIN isn't used elsewhere
- If you lose or accidentally share either your master private key, subkey, or revocation certificate you need to revoke that key. If, say, you've revoked your encryption subkey, any data that was encrypted with that subkey is vulnerable.
- If keys are close to gracefully expiring, consider renewing or regenerating that key
- If you lose a device with subkeys and master stub, you need to revoke the subkeys but you can keep your master private key and avoid restarting your web of trust
- Losing the master private key is the worst case scenario and requires revoking that entire identity and starting with a new PGP public/private pair

## Step 2: Setup Yubikey with Ubuntu & Change Hardware Mode

You need to use the [ykpersonalize](https://github.com/Yubico/yubikey-personalization) tool to change the mode on the NEO from the default demo mode to OTP+CCID mode.
`README.adoc` in the Git repository is pretty spot on, but the executive summary is

```bash
sudo apt install libyubikey-dev pkg-config libusb-1.0.0-dev git
git clone git://github.com/Yubico/yubikey-personalization.git
cd yubikey-personalization
autoreconf --install
./configure
sudo make check install
# ldconfig is important to avoid the error
# "ykinfo: error while loading shared libraries: libykpers-1.so.1: cannot open shared object file"
sudo ldconfig
# If ykpersonalize does not work, two possibilities:
#   1) Device did not connect properly...check `dmesg | tail` for something like
# [37818.368240] usb 2-1.2: New USB device found, idVendor=1050, idProduct=0111
# [37818.368252] usb 2-1.2: New USB device strings: Mfr=1, Product=2, SerialNumber=0
# [37818.368259] usb 2-1.2: Product: Yubikey NEO OTP+CCID
#   2) The current user cannot access the device. Either run via `sudo` or check
#      the section below on udev rules.
ykpersonalize -m82
# -m82 sets the mode to use modes 0x2 | 0x80 (OTP, SmartCard, MODE_FLAG_EJECT)
# -m81 or -m86 seem groovy too...check `man ykpersonlize` to learn more
# reboot the card (unplug and plug) to have the new mode kick in
```


## Step 3: Setup Yubikey SmartCard

### Out with the old

The best advice I found for this is [Chris Boot's guide](http://www.bootc.net/archives/2013/06/09/my-perfect-gnupg-ssh-agent-setup/), especially the section about starting the correct agent at login.
For me, this was the missing step that every other guide on the Internet seemed to skip.

```bash
# this removes ubuntu-gnome-desktop which removes software-center
# this seemed to affect my life in two ways:
#   1) instead of `xdg-open cool-package.deb` and software-center opening,
#      `dpkg -i cool-package.deb && apt-get -f install` do the same
#   2) to connect to one (and only one!) WiFi SSID with
#      a username/password/custom InCommon CA requires always typing password
#      this is the pos University of Miami WPA WiFi
$ sudo apt remove libpam-gnome-keyring gnome-keyring
# last one or two packages might not be necessary
$ sudo apt install gnupg-agent gpgsm pcscd libccid
```

### Add `udev` rule

To let the user manage the NEO, no combination of the Yubico documentations and `udev` rule refreshing helped.
I finally settled on the "nuclear option" given by [Thomas Habets:](https://blog.habets.se/2013/02/GPG-and-SSH-with-Yubikey-NEO)

```bash
# use your own username as the OWNER value, obviously
# make sure the permissions on this file are similar to the other files
# `99-` prefix means this rules file will be loaded last and override others
# These idVendor and idProduct attrs are identical to the Yubikey NEO
# Habets's blog uses ATTRS rather than ATTR, but both seem fine
$ cat /etc/udev/rules.d/99-yubikey.rules
SUBSYSTEM=="usb", ATTR{idVendor}=="1050", ATTR{idProduct}=="0111", OWNER="oychang"
```

### Enable `ssh-agent`

```bash
# add "use-agent" to gpg.conf
$ echo "use-agent" >> ~/.gnupg/gpg.conf
# add "enable-ssh-support"
$ echo enable-ssh-support >> ~/.gnupg/gpg-agent.conf
# in Xsession.options remove the line "use-ssh-agent" if it exists
$ vim /etc/X11/Xsession.options
# remove gnome-keyring autostart junk
$ sudo rm -f /etc/xdg/autostart/gnome-keyring-{gpg,ssh}.desktop
# NB: This file gets recreated when there is an update to gpg-agent!
$ sudo rm -f /usr/share/upstart/sessions/gpg-agent.conf
# to be safe, I like to clear all of the agent files in /tmp on reboot
$ cat /etc/default/rcS
...
TMPTIME=0
...
# To troubleshoot
$ gpgconf --check-programs
```

With the NEO plugged in, `gpg --card-status` should print out **not** errors.
If setup correctly, the key should work across many terminals and with any weird combination of token ejections and insertions.

### Load GPG Identity onto the Card

This step is thoroughly covered in Mike English's guide.
To test, use `ssh-add -L` to see your PGP public key converted into a RSA public key.

####  Troubleshooting Notes

If `sudo gpg2 --card-status` works, but `gpg2 --card-status` doesn't work
  ~ This error might also manifest as the error `gpg: selecting openpgp failed: ec=6.108`. It is slightly better than a generic error! You can try [changing the SmartCard driver](https://wiki.archlinux.org/index.php?title=GnuPG#GnuPG_together_with_OpenSC)).

IT WON'T WORK
  ~ Search for `gpg-agent.conf` files on your computer and mercilessly delete all of them. Terminate all running instances of the same. I assume you're using the GPG `prezto` plugin so I don't go over starting the various agents and setting the files and environment variables...check those. In general, the `prezto` plugin is **bulletproof** so the problem is likely not there.

Ensure you have the SmartCard with your private subkeys and your computer has your public key. `gpg2 --card-status` should look like a mini-dossier.
  ~ Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Check permissions on ~/.gnupg and ~/.gnupg/*
  ~ Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

You might _need_ to have stubs instead of full keys. When you run `gpg2 -K`, you should see `ssb>`, not `ssb`
  ~ Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

The [ArchWiki GnuPG](https://wiki.archlinux.org/index.php/GnuPG) page is invaluable for commands you can use to poke different parts of the setup to isolate your problem
  ~ Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Restart computer maybe?
  ~ Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

When I do `gpg -K` I see `sec#`, but `gpg --armor --export-secret-keys` says othwerwise?
  ~ Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Three strikes rules
  ~ Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

What does the `>` (greater than sign) mean in `gpg -K`?
  ~ See <http://lists.gnupg.org/pipermail/gnupg-users/2010-November/039892.html>


## Step 4: Setup Applications to use PGP

Here are some justifications for why you spent a week setting up GPG:

1. [pass](http://www.passwordstore.org/) is great for managing passwords. It's pretty much just a bash script that creates `.gpg` files for your individual passwords that you can edit in `vim` or `emacs` to add more details. There are negative sides to this approach like the website names being unencrypted, as well as `history` potentially showing what websites you use the most.
2. SSH authentication via public key is super easy. `ssh-agent` takes care of converting your GPG authentication key into a form for use with ssh. So you just add the output of `ssh-add -L` to the remote machine's `~/.ssh/authorized_hosts`, and magic happens! If you use git with ssh, you get authenticated pushes and pulls as well.
3. OTP codes. The system here is not great. You need to get Yubico's python applet for your PC and a pretty lackluster Yubico app for your phone. And then, you can only write new accounts (of which there can be many) via USB. And also, you need to awkwardly search for where to tap the token on your mobile device.

</div>

<!-- *********************************************************************** -->

<div class="xkcd section">

# Conclusion

![[XKCD #1811 by Randall Munroe](https://xkcd.com/1181/); [CC BY-NC 2.5]( https://creativecommons.org/licenses/by-nc/2.5/); "If you want to be extra safe, check that there's a big block of jumbled characters at the bottom."](images/pgp_xkcd.png)

Welcome to the PGP club!
The [Web of Trust](https://en.wikipedia.org/wiki/Web_of_trust) relies on real world trust so encourage people to use PGP, and get out there trusting and being trusted.
If you want to test your setup, try emailing me an encrypted message (as opposed to a non-encrypted but authenticated message pictured in the XKCD above) so we can start working on our technically accurate Snowden/Greenwald slash fiction where they setup GPG.

#### Notes

- The code for the technicolor header comes from <http://stackoverflow.com/questions/19165364> with modifications to run even when not hovered and to automatically convert a text block to individual `<span>`s
- Dominant image colors extracted using [color-thief](http://lokeshdhakar.com/projects/color-thief/)

</div>
</div>
