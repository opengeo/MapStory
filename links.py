links = {
    "wiki" : {
        "prefix" : "http://wiki.mapstory.org/wiki/",
        "links" : [
            ("curation_guide_ratings", "Curation_Guide#Ratings"),
            ("curation_guide_flag_broken", "Curation_Guide#Flagging_Content_as_Broken"),
            ("curation_guide_flag_inappropriate", "Curation_Guide#Flagging_Content_as_Inappropriate"),
            ("curation_guide_title", "Curation_Guide#Title"),
            ("curation_guide_description", "Curation_Guide#Description"),
            ("curation_guide_keywords", "Curation_Guide#Keywords"),
            ("curation_guide_abstract", "Curation_Guide#Abstract"),
            ("curation_guide_purpose", "Curation_Guide#Purpose"),
            ("curation_guide_data_source", "Curation_Guide#Data_Source"),
            ("curation_guide_data_quality_statement", "Curation_Guide#Data_Quality_Statement"),
            ("curation_guide_topics", "Curation_Guide#Topics"),
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
