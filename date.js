let seconds = 231948248;
let years = Math.floor(seconds / (60 * 60 * 24 * 365.35));
seconds = seconds % (60 * 60 * 24 * 365.35);
let months = Math.floor(seconds / (60 * 60 * 24 * 30));
seconds = seconds % (60 * 60 * 24 * 30);
let days = Math.floor(seconds / (60 * 60 * 24));
seconds = seconds % (60 * 60 * 24);
let hours = Math.floor(seconds / (60 * 60));
seconds = seconds % (60 * 60);
let minutes = Math.floor(seconds / 60);
seconds = Math.round(seconds % 60);

console.log(`${years}y ${months}m`);
console.log(`${months}m ${days}d`);
console.log(`${days}d ${hours}h`);
console.log(`${hours}h ${minutes}m`);
console.log(`${minutes}m ${seconds}s`);
console.log(`${seconds}`);
