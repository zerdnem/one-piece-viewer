"""
Test script to debug video scraping
Run this to test if scraping works for specific episodes
"""
import sys
from scrapers.video_scraper import video_scraper

def test_episode(episode_num):
    """Test scraping for a specific episode"""
    print(f"\n{'='*60}")
    print(f"Testing One Piece Episode {episode_num}")
    print(f"{'='*60}\n")
    
    result = video_scraper.get_video_url("One Piece", episode_num)
    
    if result and result.get('success'):
        print("✅ SUCCESS!")
        print(f"\nProvider: {result.get('provider')}")
        print(f"Episode: {result.get('episode')}")
        print(f"\nVideo URLs:")
        for quality, url in result.get('video_urls', {}).items():
            print(f"  {quality}: {url[:80]}..." if len(url) > 80 else f"  {quality}: {url}")
    else:
        print("❌ FAILED!")
        print(f"\nError: {result.get('error', 'Unknown error')}")
        print("\nPossible reasons:")
        print("  - Episode not available on provider")
        print("  - Provider site is down")
        print("  - Episode number format is wrong")
        print("  - Site structure has changed")
    
    print(f"\n{'='*60}\n")
    return result

def test_multiple_episodes():
    """Test multiple episodes to find working ones"""
    test_episodes = [1, 10, 100, 500, 800, 1000, 1050]
    
    print("\n" + "="*60)
    print("Testing Multiple Episodes")
    print("="*60 + "\n")
    
    working = []
    failing = []
    
    for ep in test_episodes:
        print(f"Testing episode {ep}...", end=" ")
        result = video_scraper.get_video_url("One Piece", ep)
        
        if result and result.get('success'):
            print("✅")
            working.append(ep)
        else:
            print("❌")
            failing.append(ep)
    
    print("\n" + "="*60)
    print("Summary")
    print("="*60)
    print(f"\n✅ Working episodes: {working if working else 'None'}")
    print(f"❌ Failing episodes: {failing if failing else 'None'}")
    print(f"\nSuccess rate: {len(working)}/{len(test_episodes)} ({len(working)*100//len(test_episodes)}%)")
    print()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Test specific episode from command line
        try:
            episode = int(sys.argv[1])
            test_episode(episode)
        except ValueError:
            print("Error: Please provide a valid episode number")
            print("Usage: python test_scraper.py <episode_number>")
            sys.exit(1)
    else:
        # Test multiple episodes
        test_multiple_episodes()
        
        # Show usage info
        print("\nTo test a specific episode:")
        print("  python test_scraper.py 870")
        print()

