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
