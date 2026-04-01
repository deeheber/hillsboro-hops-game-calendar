(() => {
  "use strict";

  const MONTHS = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  };

  // ── Date parsing ──

  function parseGameDate(str) {
    // Expected format: "Tue, Apr 7, 2026 6:35PM PDT"
    const m = str.match(
      /(\w+),\s+(\w+)\s+(\d{1,2}),\s+(\d{4})\s+(\d{1,2}):(\d{2})(AM|PM)/i
    );
    if (!m) return null;

    const month = MONTHS[m[2]];
    if (!month) return null;

    const day = parseInt(m[3], 10);
    const year = parseInt(m[4], 10);
    let hours = parseInt(m[5], 10);
    const minutes = parseInt(m[6], 10);
    const ampm = m[7].toUpperCase();

    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    return { year, month, day, hours, minutes };
  }

  // ── ICS helpers ──

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function formatIcsDateTime(dt) {
    return (
      "" + dt.year + pad(dt.month) + pad(dt.day) +
      "T" + pad(dt.hours) + pad(dt.minutes) + "00"
    );
  }

  function addHours(dt, h) {
    const d = new Date(dt.year, dt.month - 1, dt.day, dt.hours + h, dt.minutes);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hours: d.getHours(),
      minutes: d.getMinutes(),
    };
  }

  function icsEscape(str) {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  }

  // ── Generate .ics content ──

  function generateIcs(events) {
    const now = new Date();
    const dtstamp =
      "" + now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate()) +
      "T" + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + "Z";

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hillsboro Hops Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Hillsboro Hops Games",
      "X-WR-TIMEZONE:America/Los_Angeles",
      "BEGIN:VTIMEZONE",
      "TZID:America/Los_Angeles",
      "BEGIN:DAYLIGHT",
      "DTSTART:20070311T020000",
      "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
      "TZOFFSETFROM:-0800",
      "TZOFFSETTO:-0700",
      "TZNAME:PDT",
      "END:DAYLIGHT",
      "BEGIN:STANDARD",
      "DTSTART:20071104T020000",
      "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
      "TZOFFSETFROM:-0700",
      "TZOFFSETTO:-0800",
      "TZNAME:PST",
      "END:STANDARD",
      "END:VTIMEZONE",
    ];

    events.forEach((evt) => {
      const dtEnd = addHours(evt.dt, 3);

      lines.push("BEGIN:VEVENT");
      lines.push("UID:hops-" + evt.id + "@hillsboro-hops-calendar");
      lines.push("DTSTAMP:" + dtstamp);
      lines.push("DTSTART;TZID=America/Los_Angeles:" + formatIcsDateTime(evt.dt));
      lines.push("DTEND;TZID=America/Los_Angeles:" + formatIcsDateTime(dtEnd));
      lines.push("SUMMARY:" + icsEscape(evt.title));
      lines.push("LOCATION:" + icsEscape("Hops Ballpark, 4450 NE Century Blvd, Hillsboro, OR 97124"));
      lines.push("DESCRIPTION:" + icsEscape(evt.seats + "\nHillsboro Hops Season Tickets"));
      lines.push("STATUS:CONFIRMED");
      lines.push("TRANSP:BUSY");
      lines.push("END:VEVENT");
    });

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  // ── Scrape ticket cards from the page ──

  const buttons = document.querySelectorAll(
    "button[ticket-inventory-event-list-item]"
  );

  if (!buttons.length) {
    alert(
      "No tickets found on this page.\n\nMake sure you are on the My Tickets page and your tickets have finished loading."
    );
    return;
  }

  const seen = new Set();
  const events = [];
  let skipped = 0;

  buttons.forEach((btn) => {
    const id = btn.getAttribute("inventoryid");
    if (!id || seen.has(id)) return;
    seen.add(id);

    const rows = btn.querySelector(".mpv-rows");
    if (!rows) return;

    const titleEl = rows.querySelector(".font-primary-bold.font-rg");
    const dateEl = rows.querySelector(".font-xxs:not(.font-light)");
    const venueEl = rows.querySelector(".font-xxs.font-light");
    const seatsEl = btn.querySelector(".font-normalcase");

    const title = titleEl ? titleEl.textContent.trim() : "";
    const dateStr = dateEl ? dateEl.textContent.trim() : "";
    const venue = venueEl ? venueEl.textContent.trim() : "";
    const seats = seatsEl ? seatsEl.textContent.trim() : "";

    // Skip parking entries
    if (title.toLowerCase().startsWith("parking")) return;
    if (venue.toLowerCase().includes("parking")) return;

    const dt = parseGameDate(dateStr);
    if (!dt) {
      skipped++;
      return;
    }

    events.push({ id, title, dt, venue, seats });
  });

  if (!events.length) {
    alert("No game events found (parking entries were filtered out).");
    return;
  }

  // ── Download the .ics file ──

  const icsContent = generateIcs(events);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "hillsboro-hops-" + new Date().getFullYear() + "-games.ics";
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  let msg = "Downloaded " + events.length + " game events!";
  if (skipped > 0) {
    msg += "\n(" + skipped + " skipped due to unrecognized date format)";
  }
  alert(msg);
})();
