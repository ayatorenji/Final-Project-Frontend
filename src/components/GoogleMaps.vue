// Add this method to your Vue component
loadGoogleMapsApi() {
  return new Promise((resolve, reject) => {
    // If the API is already loaded, resolve immediately
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    // Create a script element to insert into the page
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`; // Replace YOUR_API_KEY with your API key
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Attach callback for when the API is loaded
    window.initMap = () => resolve(window.google.maps);

    // Handle possible errors
    script.onerror = () => reject(new Error('Google Maps API failed to load'));
  });
},
