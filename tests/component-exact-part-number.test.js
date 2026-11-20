const assert = require('node:assert/strict');
const {reviewCandidate} = require('../src/component-recognition');
const record = {identity:{manufacturer:'Example',model:'M1',partNumber:'P-100'}};
assert.equal(reviewCandidate({manufacturer:'Example',model:'M1'},record).status,'identity_mismatch');
assert.equal(reviewCandidate({manufacturer:'Example',model:'M1',partNumber:'P-101'},record).status,'identity_mismatch');
assert.equal(reviewCandidate({manufacturer:'Example',model:'M1',partNumber:'P-100'},record).status,'evidence_review_required');
console.log('Exact article-number recognition safety passed');
