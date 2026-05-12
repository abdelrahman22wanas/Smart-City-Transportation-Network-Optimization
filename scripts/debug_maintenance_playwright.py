from playwright.sync_api import sync_playwright
import json, time


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        logs = []
        requests = []
        page.on('console', lambda msg: logs.append({'type': msg.type, 'text': msg.text}))
        page.on('request', lambda req: requests.append({'url': req.url, 'method': req.method, 'resourceType': req.resource_type}))

        print('Opening app')
        page.goto('http://127.0.0.1:5173', timeout=60000)
        time.sleep(1.0)

        # Click Public Transit in sidebar
        page.evaluate("() => { const btns=[...document.querySelectorAll('button')]; const b=btns.find(b=>b.textContent && b.textContent.includes('Public Transit')); if(b) b.click(); }")
        time.sleep(1.0)

        # Click Solve Maintenance
        clicked = page.evaluate("() => { const btns=[...document.querySelectorAll('button')]; const b=btns.find(b=>b.textContent && b.textContent.includes('Solve Maintenance')); if(b){ b.click(); return true;} return false; }")
        time.sleep(1.5)

        # Collect API-related requests and console logs
        api_reqs = [r for r in requests if '/api/' in r['url']]

        browser.close()

        out = {'clicked': clicked, 'requests': api_reqs, 'logs': logs}
        print(json.dumps(out, indent=2))


if __name__ == '__main__':
    try:
        run()
    except Exception as e:
        print(json.dumps({'error': str(e)}))
