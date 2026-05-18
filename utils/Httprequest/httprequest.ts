export async function httprequest({
  api,
  method = "GET",
  data,
  credentials = "include",
}: {
  api: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  credentials?: RequestCredentials;
}) {

  const url = api.startsWith('http') ? api : api;

  try {
    const options: RequestInit = {
      method,
      credentials,
      headers: {},
    };

    if (method !== "GET" && data) {
      options.headers = {
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);

    const contentType = res.headers.get("content-type");

    let result;

    if (contentType?.includes("application/json")) {
      result = await res.json();
    } else {
      result = await res.text();
    }

    if (!res.ok) {
      throw result?.error || result || "Error en la petición";
    }

    return result;

  } catch (error) {
    console.error("HTTPRequest error:", error);
    throw error;
  }
}