const knownProviders = [
  "jago",
  "mandiri",
  "bca",
  "bri",
  "bni",
  "ovo",
  "gopay",
  "shopeepay",
  "dana",
  "linkaja",
  "bsi",
  "permata",
  "bjb",
  "cimb",
  "flip",
]

export const getProviderLogo = (provider: string): string | null => {
  if (!provider) return null
  const key = provider.toLowerCase().replace(/\s+/g, "")
  return knownProviders.includes(key) ? `/assets/providers/${key}.png` : null
}
