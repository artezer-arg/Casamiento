import * as Lucide from 'lucide-react';

const icons = ['MapPin', 'Calendar', 'Map', 'Check', 'Church', 'Martini', 'Sparkles', 'Utensils', 'Music', 'Moon', 'Heart', 'AlertCircle', 'Mail', 'MessageSquare'];

console.log('Checking Lucide icons:');
icons.forEach(name => {
  console.log(`${name}: ${typeof Lucide[name] !== 'undefined' ? 'OK' : 'UNDEFINED'}`);
});
