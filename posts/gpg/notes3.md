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
