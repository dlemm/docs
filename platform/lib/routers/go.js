/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const yaml = require('js-yaml');
const express = require('express');
const config = require('@lib/config.js');
const {join} = require('path');
const {readFileSync} = require('fs');
const URL = require('url').URL;
const robots = require('./robots');

const GO_LINKS_DEFINITION = join(__dirname, '../../config/go-links.yaml');

// eslint-disable-next-line new-cap
const go = express.Router();

const goLinks = yaml.safeLoad(readFileSync(GO_LINKS_DEFINITION));

go.use((request, response, next) => {
  const target = goLinks[request.path];
  if (!target) {
    // The request is handled by the default sub domain 404 handler and redirects to amp.dev
    // We cannot use the 404.html directly since its links are relative
    next();
    return;
  }
  try {
    const targetUrl = new URL(target, config.hosts.platform.base);
    response.redirect(targetUrl.toString());
    return;
  } catch (error) {
    console.log(error);
    notFound(request, response, next);
  }
});

go.use(robots('allow_all.txt'));

module.exports = go;
