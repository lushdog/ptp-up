# ptp-autoup
You need install node.js、mktorrent、ffmpeg、mediainfo.

## install nodejs

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

source ~/.profile

nvm install stable
```

## Step
1. git clone https://github.com/lushdog/ptp-autoup.git
2. cd ptp-up && npm link && npm i http-server -g

## Usage

1. ptp movies***.mkv <br>
   ptp movies***.rar <br>
   ptp movies***.mkv --nomv (don't move this file to moveDir that config sets .)
2. browse your.server.ip:9006
3. movies***.mkv-info.txt would contain description you need.

## Cofig

```
{
  "workDir": "/home/kaka/ptp", // store screenshots、torent file、mediainfo.
  "moveDir": "/home/kaka/deluge/download", // move to this folder.
  "host": "1.1.1.1", // Your server ip
  "ptpimgEmail": "", // ptpimg email
  "ptpimgPassword": "" // ptpimg password
}
```
