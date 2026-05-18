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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}${api}/${api}.php`;

  try {
    const options: RequestInit = {
      method,
      credentials, // 👈 CLAVE para cookies
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

    const result =
      contentType?.includes("application/json")
        ? await res.json()
        : await res.text();

    if (!res.ok) {
      throw result;
    }

    return result;

  } catch (error) {
    throw error;
  }
}