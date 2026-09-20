export default async (req) => {
    try {
        const url = new URL(req.url);
        const city = url.searchParams.get("city");
        const type = url.searchParams.get("type") || "weather";

        if (!city) {
            return Response.json(
                { message: "Nama kota wajib diisi." },
                { status: 400 }
            );
        }

        const API_KEY = process.env.OPENWEATHER_API_KEY;

        if (!API_KEY) {
            return Response.json(
                { message: "API key belum dikonfigurasi." },
                { status: 500 }
            );
        }

        const endpoint =
            type === "forecast"
                ? "https://api.openweathermap.org/data/2.5/forecast"
                : "https://api.openweathermap.org/data/2.5/weather";

        const apiUrl =
            `${endpoint}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=id`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        return Response.json(data, {
            status: response.status
        });

    } catch (error) {
        return Response.json(
            { message: "Terjadi kesalahan pada server." },
            { status: 500 }
        );
    }
};