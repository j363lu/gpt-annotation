const openchat = async () => {
  const completion = await fetch(
    "https://limcheekin-openchat-3-5-gguf.hf.space/v1/chat/completions", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "messages": [
          {
            "content": "You are a helpful assistant.",
            "role": "system"
          },
          {
            "content": "What is the capital of France?",
            "role": "user"
          }
        ]
      })
    }
  )
  .then(res => res.json());
  console.log(JSON.stringify(completion));

} 

openchat();