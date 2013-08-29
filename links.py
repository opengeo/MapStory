import urllib2

links = {
    "wiki" : {
        "prefix" : "http://wiki.mapstory.org/index.php?title=",
        "links" : [
            ("curation_guide_ratings", "Curation_Guide#Ratings"),
            ("license_and_copyright", "License_and_Copyright"),
            ("terms_of_service", "Terms_of_Service"),
            ("how_to", "How_To"),
            ("main_page", "Main_Page"),
            ("mapstory_org", "MapStory.org"),
            ("community", "Community"),
            ("mapstory_foundation", "The_MapStory_Foundation"),
            ("how_to_get_started", "How_To#Get_Started"),
            ("how_to_get_engaged", "How_To#Get_Engaged"),
            ("how_to_get_skillz", "How_To#Get_Skillz"),
            ("donation", "Donation"),
        ]
    }
}

for cat in links.values():
    link_list = cat['links']
    lookup = {}
    prefix = cat.get('prefix','')
    for link in link_list:
        lookup[link[0]] = prefix + link[1]
    cat['links'] = lookup

def resolve_link(cat, name):
    cat = links[cat]
    return cat['links'][name]
