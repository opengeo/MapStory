from mapstory.models import *
from dialogos.models import Comment
from django import forms
from django.contrib.auth.models import User
from django.contrib import admin
from django.core import urlresolvers
from django.contrib.auth.admin import UserAdmin
from flag import admin as flag_admin

from mapstory.reports.admin import export_via_model


def export_as_csv_action(description="Export selected objects as CSV file",
                         fields=None, exclude=None, query_factory=None):
    """
    This function returns an export csv action
    'fields' and 'exclude' work like in django ModelForm
    'header' is whether or not to output the column names as the first row
    """
    def export_as_csv(modeladmin, request, queryset):
        """
        Generic csv export admin action.
        based on http://djangosnippets.org/snippets/1697/

        queryset is an iterable returning an object
        with attributes or no-arg callables matching the field names
        """
        if query_factory:
            queryset = query_factory(queryset)

        return export_via_model(
            modeladmin.model,
            request,
            queryset,
            fields,
            exclude
        )

    export_as_csv.short_description = description
    return export_as_csv


# remove non important values form the export script
export_func = export_as_csv_action(
    exclude=[
        'password',
        'is_active',
        'is_superuser',
        'id'
    ]
)
UserAdmin.actions = [export_func]


class ResourceForm(forms.ModelForm):
    text = forms.CharField(widget=forms.Textarea)
    class Meta:
        model = Resource

class ResourceAdmin(admin.ModelAdmin):
    list_display = 'id','name','order'
    list_display_links = 'id',
    list_editable = 'name','order'
    form = ResourceForm
    ordering = ['order',]

class SectionForm(forms.ModelForm):
    text = forms.CharField(widget=forms.Textarea)
    class Meta:
        model = Section

class SectionAdmin(admin.ModelAdmin):
    list_display = 'id','name','order'
    list_display_links = 'id',
    list_editable = 'name','order'
    form = SectionForm
    ordering = ['order',]


class LinkAdmin(admin.ModelAdmin):
    list_display = 'id','name','href','order','render'
    list_display_links = 'id',
    list_editable = 'name','href','order'


class VideoLinkForm(forms.ModelForm):
    text = forms.CharField(widget=forms.Textarea)
    class Meta:
        model = VideoLink

class VideoLinkAdmin(admin.ModelAdmin):
    list_display = 'id','name','title','href','publish','location'
    list_display_links = 'id',
    list_editable = 'name','title','publish','href','location'
    form = VideoLinkForm

class ContactDetailAdmin(admin.ModelAdmin):
    pass


def user_link(obj):
    url = '/admin/auth/user/%s/' % obj.user.id
    return "<a href='%s'>User Account</a>" % url
user_link.allow_tags = True

def org_page_link(obj):
    url = obj.get_absolute_url()
    return "<a href='%s'>Org Page</a>" % url
org_page_link.allow_tags = True


class OrgAdminForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super(OrgAdminForm, self).clean()
        if self.instance.id:
            slug_text = cleaned_data['slug']
            slug_error = 'The provided slug cannot be used'
        else:
            slug_text = cleaned_data['organization']
            if len(slug_text) > 30:
                raise forms.ValidationError('The initial org name must be less '
                    ' than 30 characters. It can be changed later.')
            if User.objects.filter(username=slug_text).count():
                raise forms.ValidationError('An org user with the given name already exists')
            slug_error = 'The provided org name cannot be used'
        # check slug
        for p in urlresolvers.get_resolver(None).url_patterns:
            if p.regex.pattern and getattr(p, 'name', None) != 'org_page':
                if p.regex.match(slug_text) or p.regex.match(slug_text + '/'):
                    raise forms.ValidationError(slug_error)
        return cleaned_data


class OrgAdmin(admin.ModelAdmin):
    list_display = ('organization',user_link, org_page_link)
    exclude = ('links','ribbon_links','user', 'position', 'voice', 'fax', 'delivery', 'zipcode', 'area')
    form = OrgAdminForm

    def get_form(self, request, obj=None, **kwargs):
        if not obj:
            self.fields = ('organization',)
        else:
            self.fields = None
        return super(OrgAdmin, self).get_form(request, obj, **kwargs)


class OrgContentAdmin(admin.ModelAdmin):
    pass


class EssayForm(forms.ModelForm):
    class Meta:
        exclude = ('slug', )

    def clean(self):
        cleaned_data = super(EssayForm, self).clean()
        if cleaned_data['publish'] and not cleaned_data.get('author_photo', None):
            raise forms.ValidationError('Please provide an author_photo before publishing')
        # only validate a photo update, can do bulk sanity checking elsewhere
        updated_author_photo = cleaned_data.get('author_photo', None)
        if updated_author_photo:
            self.instance.validate_photo(url=updated_author_photo)
        return cleaned_data


def essay_link(obj):
    url = obj.get_absolute_url()
    return "<a href='%s'>Essay Page</a>" % url
essay_link.allow_tags = True


class EssayAdmin(admin.ModelAdmin):
    list_display = ('id', 'author_name', 'title', essay_link, 'publish')
    form = EssayForm


flag_admin.register_group_to_flag_types(
    ('dev_moderator', 'broken'),
    ('content_moderator', 'inappropriate')
)

def resolve_comment_absolute_url(comment):
    return comment.content_object.get_absolute_url() + "#comment-%s" % comment.id
flag_admin.register_absolute_url_resolver(Comment, resolve_comment_absolute_url)


#@hack the UserAdmin to enable sorting by date_joined
UserAdmin.list_display += ('date_joined',)

admin.site.register(VideoLink, VideoLinkAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(ContactDetail, ContactDetailAdmin)
admin.site.register(Resource, ResourceAdmin)
admin.site.register(Org, OrgAdmin)
admin.site.register(OrgContent, OrgContentAdmin)
admin.site.register(Topic)
admin.site.register(Link, LinkAdmin)
admin.site.register(Annotation)
admin.site.register(Essay, EssayAdmin)
