
extras = "apt update && apt install -y screen"

VAGRANTFILE_API_VERSION = "2"
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define "sshui-dev", primary: true do |ubuntu|
    ubuntu.vm.provision "shell", inline: extras
    ubuntu.vm.synced_folder ".", "/home/vagrant/sshui"
    ubuntu.vm.provider "docker" do |d|
      d.image = "gbevan/vagrant-ubuntu-dev:bionic"
      d.has_ssh = true
      d.volumes = [
        "/etc/localtime:/etc/localtime:ro",
        "/etc/timezone:/etc/timezone:ro"
      ]
    end
  end
end

# Note: Load ssh private key for the vagrant user from:
#   .vagrant/machines/sshui-dev/docker/private_key
