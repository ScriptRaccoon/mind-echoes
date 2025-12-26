import translations_de from '../src/lib/translations/de.json'
import translations_en from '../src/lib/translations/en.json'

function test_translation_keys() {
	const keys_de = Object.keys(translations_de)
	const keys_en = Object.keys(translations_en)
	return keys_de.join(',') === keys_en.join(',')
}

if (!test_translation_keys()) {
	console.error('translation keys do not match')
	process.exit(1)
}

process.exit(0)
