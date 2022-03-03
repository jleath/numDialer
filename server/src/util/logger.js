const logState = initiatedCalls => {
  console.log('completed:', initiatedCalls.filter(call => call.status === 'completed').length);
  console.log('idle:', initiatedCalls.filter(call => call.status === 'idle').length);
  console.log('ringing:', initiatedCalls.filter(call => call.status === 'ringing').length);
  console.log('answered:', initiatedCalls.filter(call => call.status === 'answered').length);
  console.log(initiatedCalls);
};

module.exports = { logState };