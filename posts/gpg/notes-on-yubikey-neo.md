---
title: An Accurate Guide to YubiKey GPG Wizardry
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

The [YubiKey NEO](https://www.yubico.com/products/yubikey-hardware/yubikey-neo/) is a key-sized device that provides an additional "multi-factor" level of security in addition to normal passwords that can be accessed via USB or <acronym title="Near Field Communication">NFC</acronym>.
It also functions as a powerful embedded <acronym title="GNU Privacy Guard">GPG</acronym> SmartCard for use with the <acronym title="Pretty Good Privacy">PGP</acronym> system of public-key cryptography.

Pictured are two alternative hardware tokens, a Symantec VIP and RSA SecurID.
To use multifactor authentication with a hardware token, the process is normally a second prompt after typing a normal password that requires you to type in the [time-based one-time password](https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm) that the token spits out.
The codes in the picture are expired codes--it doesn't matter that you know them now since they are continuously generated every thirty seconds; you can't reverse the shared secret that generated that code; and you would need to know the normal password anyway in addition to the <acronym title="One-Time Password">OTP</acronym>.

The most common implementation of <acronym title="Time-based One-Time Password">TOTP</acronym>, [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2), isn't even pictured--it's implemented in software rather than hardware, the tradeoff being you trust the Authenticator code and Android system to be secure instead of carrying around a token for each site you care about (tokens, especially the Symantec one, are _not_ small).
Hence the allure of the NEO: multiple TOTP data are stored and calculated on the key and you only have to trust the device you use to read the code for independent thirty second intervals.

The NEO is probably the most featureful hardware token you can buy: it is small, supports Windows, Mac, Linux, Android, <acronym title="Fast IDentity Online Universal 2nd Factor">FIDO U2F</acronym>, One-Time Passwords, HMAC-based One-Time Passwords, Time-based One-Time Passwords, HMAC-SHA1 Challange-Response, OpenPGP, Static Passwords, and SmartCards.
This page describes the **terrible, horrible, no good, very painful** Ubuntu setup process for SSH Authentication, File Storage, and OTP.

##### Notes

How is the TOTP implemented?
  ~ The NEO does not contain a power source. You need a Python application on a computer or the Yubico Android application to read the TOTP. [From Yubico,](http://www.yubico.com/wp-content/uploads/2014/02/Yubico-TOTP-Setup.pdf) the high-level description is to use "a Challenge/Response configuration to the YubiKey in HMAC-SHA1 mode using the shared OATH secret from the site or service to be secured. The helper app (YubiTOTP) passes the current system time as a challenge to the YubiKey and processes the response as per the OATH specification to generate a 6 or 8 digit OATH-TOTP code."

Could NFC TOTP data be stolen by as you walk around?
  ~ Extremely unlikely. The token stores the label and secret and those can be accessed from any device without authentication. In practice on a Moto X and Nexus 7, you need to memorize the location of the NFC antenna and align both the antenna the key to read the TOTPs. To steal data surreptitiously at distance would require [an infeasibly large antenna.](http://physics.stackexchange.com/questions/44037/why-is-near-field-communication-nfc-range-limited-to-about-20cm) To steal a TOTP code in-person by picking the NEO up off of a desk would be trivially easy.

Are they durable?
  ~ Surprisingly so! The 7-month year old NEO pictured above usually dangles off of a laptop port on a keychain along with maybe a half-dozen keys while not in-pocket or plugged into an exposed motorcycle keyhole.

</div>

<!-- *********************************************************************** -->

<div class="winter-forest section">

# Effectiveness

![[Battle of the Bulge](https://en.wikipedia.org/wiki/File:Battle_of_the_Bulge.jpg); public domain](images/bulge.jpg)

I imagine the YubiKey as similar to the Maginot Line in 1940: it makes you less vulnerable to certain common attacks, but it is not a panacea.
Improper use of security in practice, like leaving a key around or software vulnerabilities or [Van Eck phreaking](https://en.wikipedia.org/wiki/Van_Eck_phreaking) are some examples of possible Ardennes.

Software vulnerabilities in hardware tokens are not hypothetical.
In March 2011, RSA SecurID hardware tokens were found to be vulnerable because of a [phishing attack at the company.](https://en.wikipedia.org/wiki/RSA_SecurID#March_2011_system_compromise)
In April 2015, the YubiKey `ykneo-openpgp` software was found to be [vulnerable](https://developers.yubico.com/ykneo-openpgp/SecurityAdvisory%202015-04-14.html) to perform unauthenticated security operations.

A ["threat model"](https://ssd.eff.org/en/module/introduction-threat-modeling) describes how much you care about your security and what steps you should take to ensure you keep your privacy.

> If you look at security from economic terms, it's a trade-off.
> Every time you get some security, you're always trading off something.
> You're going to trade off something, either money or time, convenience, capabilities, maybe fundamental liberties.
> -[Bruce Schneier, _The security image_](https://www.ted.com/talks/bruce_schneier/transcript?language=en)

Personally, the NEO is largely an exercise in being **recreationally paranoid**.
It's not about being a wannabe whistleblower, but more believing that encryption should be [ubiquitous, automatic, ](https://www.schneier.com/blog/archives/2015/06/why_we_encrypt.html) and highly encouraged.
It also means not being entirely surprised when it turns out there are latent zero-days that rendered some parts of the encryption system impotent--while defense has the threat model, offense has an "attack model" of how much effort is worth expending to exploit a security hole.

##### Notes

YubiKey NEO vulnerability
  ~ The Yubico security advisory contains a simple test to find out if you're vulnerable and request a free replacement with the updated software. While admittedly unlikely to be an issue in the wild, if you're going to do something you may as well do it right. Worst case scenario you give Yubico your mailing address and get to give a free NEO to somebody else.

What about biometric/SMS/other security method?
  ~ I prefer the security and relative ease-of-use of the NEO. Everybody feels differently, and Bonneau et al in [The Quest to Replace Passwords (PDF)](http://research.microsoft.com/pubs/161585/QuestToReplacePasswords.pdf) have devised an [excellent table to quantify the pros and cons](images/authentication-tradeoffs-table.png) of different methods.

</div>

<!-- *********************************************************************** -->

<div class="turda section r-img-inline">

# Into the Crevasse

![[Salina Turda by Cosmin Danila](https://commons.wikimedia.org/wiki/File:Salina_Turda_045.jpg); [CC BY-SA 3.0 RO](https://creativecommons.org/licenses/by-sa/3.0/ro/deed.en) ](images/salina_turda.jpg)

Remember the part about this being a painful process?
The setup process will take _at minimum_ a few hours, and there will probably be something specific about your setup you will need to puzzle out.
GPG is a legendarily Byzantine tool; mix that with SmartCards, a dash of Linux drivers, and serve with `gnome-keyring` to get quite a [spicy](https://bugs.launchpad.net/ubuntu/+source/gnome-keyring/+bug/884856) meatball.
There is an official [Yubico Guide](https://www.yubico.com/2012/12/yubikey-neo-openpgp/), but it is almost three years old at this point and goes off the rails for my setup towards the end.
However, it does serve as a good introduction.

There are four different parts to this process:

1. Setup PGP (Hard--well, mostly time consuming--but well documented)
2. Setup YubiKey with Ubuntu & Change Hardware Mode (Easy and well documented)
3. Setup YubiKey SmartCard (Hard and poorly documented)
4. Setup Applications to use PGP (Easy and relatively well documented)


## Step 1: Setup GPG

I do not think there are specific quirks that make this setup important, but for reference this is my hardware setup.

- 2012 Thinkpad T520
- 2015 YubiKey NEO
- {Ubuntu, Xubuntu} {14.04, 14.10}
- [Z Shell](http://www.zsh.org/) with [prezto](https://github.com/sorin-ionescu/prezto)

### Install GPG2

Start by [installing GPG](https://www.gnupg.org/download/index.html).
On Ubuntu this is already done, but prefer to have the package `gnupg2`.
Both `gnupg` and `gnupg2` are actively maintained and are more-or-less identical (`gnupg2` has fewer commands AFAIK), but it's a little bit of a Python 3 situation here--you should use `gnupg2` as it is the way things are going forward and it is "better suited to desktop use".

```bash
# is there a reason nobody uses the `apt` command? it has colors!
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
  ~ If you're using `apt` or `apt-get` you're using the **authentication** part of GPG. On a `apt update && apt upgrade` you see that Ubuntu's repositories are served over `http://`. It doesn't matter that this connection is insecure (for authenticity purposes) since package integrity is verified by you with the PGP keys baked into Ubuntu and listed with `apt-key list`

Setting up GPG on an airgapped computer
  ~ The security of the PGP key generation step effects all things you do with that key. So, if you do it on an insecure computer this whole thing is moot. Thus, for super security it is advised to do this step on an airgapped computer. I did not do this, but this recent article by [Víctor Cuadrado Juan](http://viccuad.me/blog/secure-yourself-part-1-airgapped-computer-and-GPG-smartcards/) has some good pointers for airgapping and a neat wristband transportation idea.

### Setup your public and private GPG keys

This step of the process is very well-documented online.
[Mike English's guide](http://spin.atomicobject.com/2013/11/24/secure-gpg-keys-guide/) is my absolute favorite because he describes the rationale behind subkeys.
Note that when you generate your keys the maximum length they can be for the Neo is 2048-bits.
As Yubico  [explain](https://www.yubico.com/2015/02/big-debate-2048-4096-yubicos-stand/), this is an intentional choice based on a tradeoff between product price, processing speed, and pragmatic obsolescence since <acronym title="Elliptic Curves Cryptography">ECC</acronym> is where the future is, not arbitrarily large keys.

Another great resource is [Riseup's Best Practices guide](https://help.riseup.net/en/security/message-security/openpgp/best-practices) that goes into some good advice for distributing your public key.
Also consider [Alex Cabal's guide](https://alexcabal.com/creating-the-perfect-gpg-keypair/) for an Ubuntu-specific guide.

### Check the Backups

Don't lock yourself out of your own house...make multiple backups and consider how things might fail.

- If you lose the YubiKey, you need to go reset your OTP schemes, revoke your subkeys, and make sure your YubiKey PIN isn't vulnerable and used elsewhere
- If you lose or accidentally share either your master private key, subkey, or revocation certificate you need to revoke that key. If, say, you've revoked your encryption subkey, any data that was encrypted with that subkey is still accessible with the revoked subkey and is thus vulnerable.
- If keys are close to gracefully expiring, consider renewing or regenerating that key
- If you lose a device with subkeys and master stub, you need to revoke the subkeys but you can keep your master private key and avoid restarting your web of trust
- Losing the master private key is the worst case scenario and requires revoking that entire identity and starting with a new PGP keypair

## Step 2: Setup YubiKey with Ubuntu & Change Hardware Mode

Use the [ykpersonalize](https://github.com/Yubico/yubikey-personalization) tool to change the mode on the NEO from the default demo mode to OTP+CCID mode.
The `README.adoc` in the Git repository is pretty spot on, but the executive summary is

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


## Step 3: Setup YubiKey SmartCard

### Out with the old

The best advice I found for this is [Chris Boot's guide](http://www.bootc.net/archives/2013/06/09/my-perfect-gnupg-ssh-agent-setup/), especially the section about starting the correct agent at login.
For me, this was the missing step that every other guide on the Internet seemed to skip.

```bash
# this removes ubuntu-gnome-desktop which removes software-center
# this seemed to affect my life in two ways:
#   1) instead of `xdg-open cool-package.deb` and software-center opening,
#      `sudo dpkg -i cool-package.deb && sudo apt-get -f install` do the same
#   2) to connect to one (and only one!) WiFi SSID with
#      a username+password+InCommon Cert requires always typing a password
$ sudo apt remove libpam-gnome-keyring gnome-keyring
# last one or two packages might not be necessary
$ sudo apt install gnupg-agent gpgsm pcscd libccid
```

### Add `udev` rule

To let the user manage the NEO, no combination of the Yubico documentations and `udev` rule refreshing helped.
I finally settled on the "nuclear option" given by [Thomas Habets:](https://blog.habets.se/2013/02/GPG-and-SSH-with-Yubikey-NEO)

```bash
# use your own username as the OWNER value
# make sure the permissions on this file are correct
# `99-` prefix means this rules file will be loaded last and override others
# These idVendor and idProduct attrs are identical to the YubiKey NEO
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
$ sudo vim /etc/X11/Xsession.options
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

With the NEO plugged in, `gpg --card-status` should now work and not print out errors.
If setup correctly, the token should work across many terminals and with any weird combination of token ejections and insertions.

### Load GPG Identity onto the Card

This step is straightforward and thoroughly covered in Mike English's guide.
To test, use `ssh-add -L` to see your PGP public key converted into a RSA public key.

####  Troubleshooting Notes

- The [ArchWiki GnuPG](https://wiki.archlinux.org/index.php/GnuPG) page is useful for general troubleshooting
- Remove and insert the NEO to restart
- Restart the computer
- Check permissions on ~/.gnupg and ~/.gnupg/*

`sudo gpg2 --card-status` works, but `gpg2 --card-status` doesn't work
  ~ This error might also manifest as `gpg: selecting openpgp failed: ec=6.108`. You can try [changing the SmartCard driver](https://wiki.archlinux.org/index.php?title=GnuPG#GnuPG_together_with_OpenSC).

Generic error
  ~ Search for `gpg-agent.conf` files on your computer and mercilessly delete all of them. Terminate all running instances of the same. Assuming you're using the GPG `prezto` plugin, it will automatically start the various agents create files and set environment variables for you. In general, the plugin is **bulletproof** so the problem is likely not there.

You _need_ to have stubs instead of full keys. When you run `gpg2 -K`, you should see `ssb>`, not `ssb`
  ~ The `>` (greater than sign) mean in `gpg -K` indicates that the key is on a card (mode 1002) while the `#` (pound sign) means there is only a partial key stored (mode 1001). See [this thread](http://lists.gnupg.org/pipermail/gnupg-users/2010-November/039892.html) for a summary, or check out the `g10` directory in the `gnupg` Git repository.

When I do `gpg -K` I see `sec#`, but `gpg --armor --export-secret-keys` says othwerwise?
  ~ You are only exporting the partial master secret key, not the actual master secret key. A `wc -l` comparison of my partial key and complete key shows that the partial key has less than 58% of the lines of the original key.

Three strikes you're out
  ~ It seems incredibly easy to brute force the PIN of the SmartCard since it is so much smaller than the full keyring passphrase. To combat this, you can only get the key wrong up to three times before the key will refuse to unlock. To unlock the token, you need to do `gpg --card-edit`, enter the administrator interface, and reset the counter. To check if you need to do this, look at the `PIN retry counter` row of `gpg --card-status`.

## Step 4: Setup Applications to use PGP

Here are some justifications for why you spent a week setting up GPG:

1. [pass](http://www.passwordstore.org/) is great for managing passwords. It's pretty much just a bash script that creates `.gpg` files for your individual passwords that you can edit in `vim` or `emacs` to add more details. There are negative sides to this approach like the website names being unencrypted, as well as `history` potentially showing what websites you use the most.
2. SSH authentication via public key is super easy. `ssh-agent` takes care of converting your GPG authentication key into a form for use with ssh. So you just add the output of `ssh-add -L` to the remote machine's `~/.ssh/authorized_hosts`, and whenever you want to SSH you should be prompted to enter your PIN which unlocks the use of the authentication subkey which is used for normal RSA authentication. Once you've authenticated and logged in, you can even remove the NEO. If you use Git with `ssh`, you get authenticated pushes and pulls as well.
3. OTP codes. The system here is not great. You need to get Yubico's python applet for your PC and a pretty lackluster Yubico app for your phone. And then, you can only write new accounts (of which there can be many) via USB. And also, you need to awkwardly search for where to tap the token on your mobile device. It can be awkward to use in conjunction with `pass` since you need to plug in via USB to decrypt the `password.gpg` file then unplug and tap since CCID and OTP mode cannot be active at the same time.

</div>

<!-- *********************************************************************** -->

<div class="xkcd section">

# Conclusion

![[XKCD #1811 by Randall Munroe](https://xkcd.com/1181/); [CC BY-NC 2.5]( https://creativecommons.org/licenses/by-nc/2.5/); "If you want to be extra safe, check that there's a big block of jumbled characters at the bottom."](images/pgp_xkcd.png)

The PGP [Web of Trust](https://en.wikipedia.org/wiki/Web_of_trust) relies on real world trust so encourage people to use PGP!
If you want to test your setup, try emailing me an encrypted message (as opposed to the non-encrypted but signed message pictured in the XKCD above) so we can start working on our technically accurate Snowden/Greenwald slash fiction where they setup GPG.

#### Notes

- The code for the technicolor header comes from <http://stackoverflow.com/questions/19165364> with modifications to run when not hovered and to automatically convert a text block to individual `<span>`s
- Dominant image colors extracted using [color-thief](http://lokeshdhakar.com/projects/color-thief/)

</div>
</div>
