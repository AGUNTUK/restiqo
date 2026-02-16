from playwright.sync_api import sync_playwright
import time

def test_restiqo():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()
        
        # Capture console logs
        console_logs = []
        page.on('console', lambda msg: console_logs.append(f'{msg.type}: {msg.text}'))
        
        # Capture errors
        errors = []
        page.on('pageerror', lambda err: errors.append(str(err)))
        
        print("=" * 60)
        print("RESTIQO APP TESTING")
        print("=" * 60)
        
        # Test 1: Homepage
        print("\n📍 Test 1: Homepage")
        print("-" * 40)
        try:
            page.goto('https://restiqo.vercel.app', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            # Check title
            title = page.title()
            print(f"✓ Page title: {title}")
            
            # Check navbar
            navbar = page.locator('nav').first()
            if navbar.is_visible():
                print("✓ Navbar is visible")
            
            # Check hero section
            hero = page.locator('text=Discover Your Perfect Stay').first()
            if hero.is_visible():
                print("✓ Hero section is visible")
            
            # Check navigation links
            nav_links = ['Apartments', 'Hotels', 'Tours']
            for link in nav_links:
                if page.locator(f'text={link}').first().is_visible():
                    print(f"✓ {link} link is visible")
            
            # Take screenshot
            page.screenshot(path='/tmp/homepage.png', full_page=True)
            print("✓ Homepage screenshot saved")
            
        except Exception as e:
            print(f"✗ Homepage test failed: {e}")
        
        # Test 2: Apartments Page
        print("\n📍 Test 2: Apartments Page")
        print("-" * 40)
        try:
            page.goto('https://restiqo.vercel.app/apartments', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            # Check page content
            if page.locator('text=Apartments').first().is_visible():
                print("✓ Apartments page loaded")
            
            page.screenshot(path='/tmp/apartments.png', full_page=True)
            print("✓ Apartments screenshot saved")
            
        except Exception as e:
            print(f"✗ Apartments test failed: {e}")
        
        # Test 3: Hotels Page
        print("\n📍 Test 3: Hotels Page")
        print("-" * 40)
        try:
            page.goto('https://restiqo.vercel.app/hotels', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            if page.locator('text=Hotels').first().is_visible():
                print("✓ Hotels page loaded")
            
            page.screenshot(path='/tmp/hotels.png', full_page=True)
            print("✓ Hotels screenshot saved")
            
        except Exception as e:
            print(f"✗ Hotels test failed: {e}")
        
        # Test 4: Tours Page
        print("\n📍 Test 4: Tours Page")
        print("-" * 40)
        try:
            page.goto('https://restiqo.vercel.app/tours', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            if page.locator('text=Tours').first().is_visible():
                print("✓ Tours page loaded")
            
            page.screenshot(path='/tmp/tours.png', full_page=True)
            print("✓ Tours screenshot saved")
            
        except Exception as e:
            print(f"✗ Tours test failed: {e}")
        
        # Test 5: Login Page
        print("\n📍 Test 5: Login Page")
        print("-" * 40)
        try:
            page.goto('https://restiqo.vercel.app/auth/login', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            if page.locator('text=Welcome Back').first().is_visible():
                print("✓ Login page loaded")
            
            if page.locator('input[type="email"]').first().is_visible():
                print("✓ Email input is visible")
            
            if page.locator('input[type="password"]').first().is_visible():
                print("✓ Password input is visible")
            
            page.screenshot(path='/tmp/login.png', full_page=True)
            print("✓ Login screenshot saved")
            
        except Exception as e:
            print(f"✗ Login test failed: {e}")
        
        # Test 6: Signup Page
        print("\n📍 Test 6: Signup Page")
        print("-" * 40)
        try:
            page.goto('https://restiqo.vercel.app/auth/signup', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            if page.locator('text=Create Account').first().is_visible():
                print("✓ Signup page loaded")
            
            page.screenshot(path='/tmp/signup.png', full_page=True)
            print("✓ Signup screenshot saved")
            
        except Exception as e:
            print(f"✗ Signup test failed: {e}")
        
        # Test 7: Search Page
        print("\n📍 Test 7: Search Page")
        print("-" * 40)
        try:
            page.goto('https://restiqo.vercel.app/search', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            # Check for search filters
            if page.locator('text=Search').first().is_visible() or page.locator('input').first().is_visible():
                print("✓ Search page loaded")
            
            page.screenshot(path='/tmp/search.png', full_page=True)
            print("✓ Search screenshot saved")
            
        except Exception as e:
            print(f"✗ Search test failed: {e}")
        
        # Test 8: Sitemap
        print("\n📍 Test 8: Sitemap")
        print("-" * 40)
        try:
            page.goto('https://restiqo.vercel.app/sitemap.xml', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            content = page.content()
            if 'urlset' in content or 'sitemap' in content.lower():
                print("✓ Sitemap is accessible")
            else:
                print("⚠ Sitemap may have issues")
            
        except Exception as e:
            print(f"✗ Sitemap test failed: {e}")
        
        # Test 9: Robots.txt
        print("\n📍 Test 9: Robots.txt")
        print("-" * 40)
        try:
            page.goto('https://restiqo.vercel.app/robots.txt', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            content = page.content()
            if 'User-agent' in content or 'Allow' in content or 'Disallow' in content:
                print("✓ Robots.txt is accessible")
            else:
                print("⚠ Robots.txt may have issues")
            
        except Exception as e:
            print(f"✗ Robots.txt test failed: {e}")
        
        # Test 10: Footer
        print("\n📍 Test 10: Footer")
        print("-" * 40)
        try:
            page.goto('https://restiqo.vercel.app', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            # Scroll to footer
            page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            time.sleep(1)
            
            footer = page.locator('footer').first()
            if footer.is_visible():
                print("✓ Footer is visible")
                
                # Check footer links
                if page.locator('text=About Us').first().is_visible():
                    print("✓ About Us link in footer")
                if page.locator('text=Contact').first().is_visible() or page.locator('text=Contact Us').first().is_visible():
                    print("✓ Contact link in footer")
            
        except Exception as e:
            print(f"✗ Footer test failed: {e}")
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        if errors:
            print(f"\n⚠ Page Errors Found ({len(errors)}):")
            for error in errors[:5]:  # Show first 5 errors
                print(f"  - {error[:100]}")
        else:
            print("\n✓ No page errors detected")
        
        if console_logs:
            error_logs = [log for log in console_logs if 'error' in log.lower()]
            if error_logs:
                print(f"\n⚠ Console Errors ({len(error_logs)}):")
                for log in error_logs[:5]:
                    print(f"  - {log[:100]}")
        
        print("\n✓ Testing completed!")
        print("\nScreenshots saved to /tmp/")
        
        browser.close()

if __name__ == "__main__":
    test_restiqo()
