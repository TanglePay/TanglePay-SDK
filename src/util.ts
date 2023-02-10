const mobileAgents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
export const checkIsPc = () => {
  const agent = navigator.userAgent;
  for (const mobileAgent of mobileAgents) {
    if (agent.includes(mobileAgent)) return true;
  }
  return false;
};
