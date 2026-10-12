#!/usr/bin/env node
/** Validates the authored topic catalog without network access. */
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const topics = JSON.parse(fs.readFileSync(path.join(root, 'data', 'topics.json'), 'utf8'));
const ids = new Set(topics.map(topic => topic.id));
const required = ['id','title','symbol','level','status','module','area','prerequisites','learningObjectives','estimatedMinutes','tags','misconceptions','lastReviewed','reviewStatus','references'];
const errors = [];

if (topics.length !== 84) errors.push('Expected 84 topics, found ' + topics.length + '.');
for (const topic of topics) {
  for (const field of required) if (topic[field] === undefined) errors.push(topic.id + ': missing ' + field);
  if (!fs.existsSync(path.join(root, topic.module || ''))) errors.push(topic.id + ': missing module ' + topic.module);
  for (const dependency of topic.prerequisites || []) if (!ids.has(dependency)) errors.push(topic.id + ': unknown prerequisite ' + dependency);
}

function visit(id, trail) {
  if (trail.includes(id)) { errors.push('Prerequisite cycle: ' + trail.concat(id).join(' -> ')); return; }
  const topic = topics.find(item => item.id === id);
  for (const dependency of (topic && topic.prerequisites) || []) visit(dependency, trail.concat(id));
}
for (const id of ids) visit(id, []);

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Catalog valid: ' + topics.length + ' topics, unique IDs and acyclic prerequisites.');
