const fetcher = async (...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export default fetcher;
