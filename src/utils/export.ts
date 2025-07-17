import { TimeSlot } from '../types';

export const generateCalendarText = (dayPlan: TimeSlot[], cityName: string, date: string = new Date().toISOString().split('T')[0]): string => {
  const events = dayPlan.filter(slot => slot.item);
  
  let calendarText = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//vibetrail//EN\nCALSCALE:GREGORIAN\n\n`;
  
  events.forEach(slot => {
    if (slot.item) {
      const startTime = slot.time.replace(/[^\d]/g, '').padStart(4, '0');
      const startDateTime = `${date.replace(/-/g, '')}T${startTime}00`;
      
      calendarText += `BEGIN:VEVENT\n`;
      calendarText += `DTSTART:${startDateTime}\n`;
      calendarText += `SUMMARY:${slot.item.name}\n`;
      calendarText += `DESCRIPTION:${slot.item.description}\\n\\n${slot.explanation || ''}\n`;
      calendarText += `LOCATION:${slot.item.location}\n`;
      calendarText += `END:VEVENT\n\n`;
    }
  });
  
  calendarText += `END:VCALENDAR`;
  
  return calendarText;
};

export const downloadCalendar = (dayPlan: TimeSlot[], cityName: string): void => {
  const calendarText = generateCalendarText(dayPlan, cityName);
  const blob = new Blob([calendarText], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tastetrails-${cityName.toLowerCase()}-plan.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};