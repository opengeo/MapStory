links = {
    "wiki" : {
        "prefix" : "http://wiki.mapstory.org/index.php?title=",
        "links" : [
            ("curation_guide_ratings", "Curation_Guide#Ratings"),
            ("curation_guide_flag_broken", "Curation_Guide#Flagging_Content_as_Broken"),
            ("curation_guide_flag_inappropriate", "Curation_Guide#Flagging_Content_as_Inappropriate"),
            ("curation_guide_flag_inaccurate", "Curation_Guide#Flagging_Content_as_Inaccurate"),
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
