# ToolVerse — API Provider Integration Notes

This document describes the provider adapters, rate limits, caching policies, and environment setup required for server/API tools.

---

## 1. Weather API Adapter
- **Provider:** Open-Meteo API (Free & Open Access, no API key required for standard rate)
- **Base URL:** `https://api.open-meteo.com/v1`
- **Features:** Geocoding, Current Weather, 7-Day Hourly Forecast, Wind Speed, UV Index, Sunrise/Sunset.
- **Cache Policy:** 15-minute response caching in Memory/KV to respect provider servers.

---

## 2. Currency Exchange Rate Adapter
- **Provider:** Frankfurter API (European Central Bank data source)
- **Base URL:** `https://api.frankfurter.app`
- **Features:** Real-time spot exchange rates, date-based historical rates.
- **Cache Policy:** 1-hour response caching.

---

## 3. Cryptocurrency Price Adapter
- **Provider:** CoinGecko API / Compatible Crypto Provider
- **Env Variable:** `COINGECKO_API_KEY`
- **Features:** Current market price, crypto converter, profit/loss calculator, DCA calculator.
- **Cache Policy:** 5-minute response caching.
- **Disclaimer:** Educational estimate only; not financial or investment advice.

---

## 4. News Headlines Adapter
- **Env Variable:** `NEWS_API_KEY`
- **Rules:** Show headline, source name, publication date, and outbound article link. Never store or reproduce full copyrighted articles.

---

## 5. YouTube Data API Adapter
- **Env Variable:** `YOUTUBE_API_KEY`
- **Rules:** Official YouTube Data API v3 endpoints only. Never scrape restricted data or provide video download bypasses.
