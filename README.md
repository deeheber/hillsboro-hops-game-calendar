# Hillsboro Hops Game Calendar ⚾️

A bookmarklet that exports your [Hillsboro Hops](https://www.milb.com/hillsboro) season ticket games to a calendar file (`.ics`). Works with Apple Calendar, Google Calendar, Outlook, and any app that supports `.ics` files.

Parking passes are automatically excluded — only game events are exported. If you swap tickets during the season, just run it again and reimport.

## One-time setup

Save this bookmarklet to your browser's bookmark bar. You only need to do this once.

### The bookmarklet code

Copy this entire line (it will look like gibberish — that's ok):

```
javascript:void((()=>{"use strict";const e={Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};function t(e){return e<10?"0"+e:""+e}function n(e){return""+e.year+t(e.month)+t(e.day)+"T"+t(e.hours)+t(e.minutes)+"00"}function o(e){return e.replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n")}const r=document.querySelectorAll("button[ticket-inventory-event-list-item]");if(!r.length)return void alert("No tickets found on this page.\n\nMake sure you are on the My Tickets page and your tickets have finished loading.");const s=new Set,a=[];let u=0;if(r.forEach(t=>{const n=t.getAttribute("inventoryid");if(!n||s.has(n))return;s.add(n);const o=t.querySelector(".mpv-rows");if(!o)return;const r=o.querySelector(".font-primary-bold.font-rg"),i=o.querySelector(".font-xxs:not(.font-light)"),l=o.querySelector(".font-xxs.font-light"),c=t.querySelector(".font-normalcase"),T=r?r.textContent.trim():"",d=i?i.textContent.trim():"",E=l?l.textContent.trim():"",h=c?c.textContent.trim():"";if(T.toLowerCase().startsWith("parking"))return;if(E.toLowerCase().includes("parking"))return;const p=function(t){const n=t.match(/(\w+),\s+(\w+)\s+(\d{1,2}),\s+(\d{4})\s+(\d{1,2}):(\d{2})(AM|PM)/i);if(!n)return null;const o=e[n[2]];if(!o)return null;const r=parseInt(n[3],10),s=parseInt(n[4],10);let a=parseInt(n[5],10);const u=parseInt(n[6],10),i=n[7].toUpperCase();return"PM"===i&&12!==a&&(a+=12),"AM"===i&&12===a&&(a=0),{year:s,month:o,day:r,hours:a,minutes:u}}(d);p?a.push({id:n,title:T,dt:p,venue:E,seats:h}):u++}),!a.length)return void alert("No game events found (parking entries were filtered out).");const i=function(e){const r=new Date,s=""+r.getUTCFullYear()+t(r.getUTCMonth()+1)+t(r.getUTCDate())+"T"+t(r.getUTCHours())+t(r.getUTCMinutes())+t(r.getUTCSeconds())+"Z",a=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Hillsboro Hops Calendar//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Hillsboro Hops Games","X-WR-TIMEZONE:America/Los_Angeles","BEGIN:VTIMEZONE","TZID:America/Los_Angeles","BEGIN:DAYLIGHT","DTSTART:20070311T020000","RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU","TZOFFSETFROM:-0800","TZOFFSETTO:-0700","TZNAME:PDT","END:DAYLIGHT","BEGIN:STANDARD","DTSTART:20071104T020000","RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU","TZOFFSETFROM:-0700","TZOFFSETTO:-0800","TZNAME:PST","END:STANDARD","END:VTIMEZONE"];return e.forEach(e=>{const t=function(e,t){const n=new Date(e.year,e.month-1,e.day,e.hours+t,e.minutes);return{year:n.getFullYear(),month:n.getMonth()+1,day:n.getDate(),hours:n.getHours(),minutes:n.getMinutes()}}(e.dt,3);a.push("BEGIN:VEVENT"),a.push("UID:hops-"+e.id+"@hillsboro-hops-calendar"),a.push("DTSTAMP:"+s),a.push("DTSTART;TZID=America/Los_Angeles:"+n(e.dt)),a.push("DTEND;TZID=America/Los_Angeles:"+n(t)),a.push("SUMMARY:"+o(e.title)),a.push("LOCATION:"+o("Hops Ballpark, 4450 NE Century Blvd, Hillsboro, OR 97124")),a.push("DESCRIPTION:"+o(e.seats+"\nHillsboro Hops Season Tickets")),a.push("STATUS:CONFIRMED"),a.push("TRANSP:BUSY"),a.push("END:VEVENT")}),a.push("END:VCALENDAR"),a.join("\r\n")}(a),l=new Blob([i],{type:"text/calendar;charset=utf-8"}),c=URL.createObjectURL(l),T=document.createElement("a");T.href=c,T.download="hillsboro-hops-"+(new Date).getFullYear()+"-games.ics",document.body.appendChild(T),T.click(),setTimeout(()=>{document.body.removeChild(T),URL.revokeObjectURL(c)},100);let d="Downloaded "+a.length+" game events!";u>0&&(d+="\n("+u+" skipped due to unrecognized date format)"),alert(d)})())
```

### Firefox

1. Show the **Bookmarks Toolbar**: press `Ctrl+Shift+B` (Windows) / `Cmd+Shift+B` (Mac)
2. Right-click the toolbar > **Add Bookmark...**
3. **Name**: `Hops Calendar`
4. **URL**: paste the bookmarklet code
5. Click **Save**

### Chrome

1. Show the **Bookmarks Bar**: press `Ctrl+Shift+B` (Windows) / `Cmd+Shift+B` (Mac)
2. Right-click the bar > **Add page...**
3. **Name**: `Hops Calendar`
4. **URL**: paste the bookmarklet code
5. Click **Save**

### Safari

1. Go to **View** > **Show Favorites Bar**
2. Bookmark any page to **Favorites**
3. Right-click that bookmark > **Edit Address...** > replace with the bookmarklet code
4. Right-click > **Rename** to `Hops Calendar`

## How to use it

1. **Log in** to the [Hops ticket site](https://mlb.tickets.com/ticketmanagement/?agency=HOPM_MYTIXX&orgid=58152#/tickets)
2. Click **View All Ticket Inventory**
3. Click the **month drop-down** and select **All**
4. Click the `Hops Calendar` bookmark in your bookmark bar
5. A `.ics` file will download and a popup will confirm how many games were exported

## Importing into Apple Calendar

We recommend creating a dedicated **Hops Games** calendar so it's easy to delete and reimport after ticket swaps.

1. **File** > **New Calendar** > name it **Hops Games**
2. Double-click the downloaded `.ics` file
3. Select the **Hops Games** calendar when prompted

On iPhone/iPad: open the `.ics` file from Files or a message and it will offer to add the events.

## Importing into Google Calendar

1. In [Google Calendar](https://calendar.google.com), click **+** next to **Other calendars** > **Create new calendar** > name it **Hops Games**
2. Go to **Settings** > **Import & export** > **Import**
3. Choose the `.ics` file and select the **Hops Games** calendar

To share: send the `.ics` file to someone and they can import it using the same steps.

## After swapping tickets

Delete the **Hops Games** calendar, recreate it, run the bookmarklet again, and reimport.

- **Apple Calendar**: right-click **Hops Games** in the sidebar > **Delete**, then recreate and reimport
- **Google Calendar**: **Settings** > **Hops Games** > **Delete calendar**, then recreate and reimport

## Known limitations

This bookmarklet scrapes the ticket site's page structure. If MLB/tickets.com redesigns the page, the bookmarklet may stop working. If that happens, [open an issue](../../issues) and we'll update it.

## Troubleshooting

**"Nothing happened when I clicked the bookmarklet"**
- Make sure you're on the ticket page and your tickets are visible
- Check that the bookmark URL starts with `javascript:` — some browsers strip this when pasting. Type `javascript:` manually first, then paste the rest.

**"I don't see all my games"**
- Make sure you selected **All** in the month drop-down before clicking the bookmarklet
- Parking passes are intentionally skipped

**"No tickets found"**
- Make sure you're logged in and tickets have finished loading

## For developers

Source code is in `src/bookmarklet.js`. To rebuild after changes:

```bash
./scripts/build-bookmarklet.sh
```

Outputs to `dist/bookmarklet.txt`. Uses [terser](https://terser.org/) if available, otherwise falls back to shell-based minification.
