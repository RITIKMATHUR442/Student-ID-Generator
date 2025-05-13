
## 🧾 Card Preview & Download  
Once the user fills out the form, a real-time preview of the ID card is generated based on the selected template. The ID card includes:

- Student details (name, roll number, class, etc.)
- A photo upload
- Allergy information (optional)
- A stylish, animated QR code containing student data

A **Download as PNG** button is provided, which uses the `html-to-image` library to export the card as a high-resolution image for offline use.

---

## 🧠 Thought Process  

The goal was to design a smart and flexible student ID generator that feels modern and intuitive. My key considerations:

- **User-Friendly Form**: Clean and simple input for all required student details.
- **Visual Feedback**: Live card preview so users can immediately see their inputs reflected.
- **QR Code Integration**: Compact and secure way to embed all data on the card.
- **Template Flexibility**: Dropdown to switch between different card designs.
- **Persistent Storage**: Used `localStorage` to keep past entries accessible.
- **Export Functionality**: Enabled download so schools/parents can easily save or print the cards.

Live Server  : https://ids-card-generator.netlify.app/
