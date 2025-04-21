export const validateData = async (jsonData: any) => {
  const response = await fetch("http://localhost:5000/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tables: jsonData }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
