#!/usr/bin/env node

const CommandLineInterface = require('../lib/CommandLineInterface')
new CommandLineInterface().run({ paths: process.argv.slice(2) })
