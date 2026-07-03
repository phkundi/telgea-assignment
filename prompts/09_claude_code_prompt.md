You got confused on one point - right now, the "Install not confirmed" case shows the user his new number and says "text START to your new number". This doesn't make sense - the way its supposed to work: User sees a Telgea-owned number and is instructed to text a code to that number (not START). The Telgea-owned verification number is monitored: if it receives the specified code from the number that was assigned to the user, we verified that the user's new number has been connected successfully. If the verification number receives the code from a different number, it means that the user is still connected to his previous line. The code is used to identify the user. Please adapt this.

Then continue with M6. Here are some additional instructions:

- Use FC Barcelona Logo: /Users/philippkundratitz/Projekte/Telgea/src/assets/fcb.webp
- Use Telgea Logo also in Center screen somewhere, to emphasize that this screen is owned by Telgea: /Users/philippkundratitz/Projekte/Telgea/src/assets/telgea.png
- For FC Barcelona branding, use #0A0927 as primary background color and #FDC52C as accent color
- Make sure that its more obvious that panel 1 and panel 2 are supposed to represent two different windows.
- Remove any annotations that narrate the POC
