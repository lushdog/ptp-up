#! /usr/bin/env node

const fs = require('fs')
const hasFlag = require('has-flag')
const shelljs = require('shelljs')
const uploadimg = require('../src/uploadimg')

const argv = process.argv
const config = require('../config.json')
let target = argv[2]
const folder = target
shelljs.exec(`mkdir ${config.workDir}/${folder}`)
if (!argv[2]) {
	console.log('参数错误')
	process.exit()
}

// make torrent
let piece = '23'
if (/\.mkv$/.test(target)) {
	const size = shelljs.exec(`du ./${target}`).stdout.split('\t')[0]
	if (size/1024/1024 < 2) {
		piece = '21'
	}
	shelljs.exec(`mktorrent -v -p -l ${piece} -a ${config.announce} -o ${config.workDir}/${folder}/${target}.torrent ${target}`)
} else {
	// unrar if necessary
	shelljs.exec(`unrar e ${target}`)
	target = shelljs.ls('*.mkv')[0]
	if (!/x264|x265/.test(target)) {
		const pwd = shelljs.exec('pwd').split('/')
		const properName = pwd[pwd.length - 1]
		const newTarget = `${properName.trim()}.mkv`
		shelljs.mv(target, newTarget)
		target = newTarget
	}
	const sizeT = shelljs.exec(`du ./${target}`).stdout.split('\t')[0]
	if (sizeT/1024/1024 < 2) {
		piece = '21'
	}
	shelljs.exec(`mktorrent -v -p -l ${piece} -a ${config.announce} -o ${config.workDir}/${folder}/${target}.torrent ${target}`)
}

// make screenshots
shelljs.exec(`ffmpeg -y -ss 1000  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${folder}/${target}-s1.png`)
shelljs.exec(`ffmpeg -y -ss 1500  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${folder}/${target}-s2.png`)
shelljs.exec(`ffmpeg -y -ss 2000  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${folder}/${target}-s3.png`)
shelljs.exec(`ffmpeg -y -ss 3000  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${folder}/${target}-s4.png`)
shelljs.exec(`ffmpeg -y -ss 3600  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${folder}/${target}-s5.png`)
shelljs.exec(`ffmpeg -y -ss 4500  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${folder}/${target}-s6.png`)

// mediainfo
const mediainfo = shelljs.exec(`mediainfo ${target}`, { silent:true }).stdout
fs.writeFileSync(`${config.workDir}/${folder}/${target}-mediainfo.txt`, `[mediainfo]${mediainfo}[/mediainfo]`)
!hasFlag('nomv') && shelljs.mv(target, config.moveDir)


// serve static files 
shelljs.cd(config.workDir)
const child = shelljs.exec('http-server -p 9006', { async: true })
child.stdout.on('data', async (data) => {
})

setTimeout(async () => {
	const result = await uploadimg([
		`http://${config.ip}:9006/${folder}/${target}-s1.png`,
		`http://${config.ip}:9006/${folder}/${target}-s2.png`,
		`http://${config.ip}:9006/${folder}/${target}-s3.png`,
		`http://${config.ip}:9006/${folder}/${target}-s4.png`
	]).catch(() => {
		console.log('upload imgs failed!')
	})

	fs.writeFileSync(`${config.workDir}/${folder}/${target}-info.txt`, `[mediainfo]${mediainfo}[/mediainfo]\n${result}`)
}, 10000)

