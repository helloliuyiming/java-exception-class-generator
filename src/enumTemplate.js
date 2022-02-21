export let enumTemplate =
`{%if package %}package {{package}}; {% endif %}

public enum {{name}}{
    {% for property in properties %}
    {{property.enum}}{% for col in cols %}{% if loop.first %}({% endif %}{{property[col.name]}}{% if loop.last %}){% else %}, {% endif %}{% endfor %}{% if loop.last %};{% else %},{% endif %}
    {% endfor %}
    {% for col in cols %}
    private {{col.type}} {{col.name}} = {% if col.defaultValue %} {% if col.type==='String' %}"{% endif %}{{col.defaultValue}}{% if col.type==='String' %}"{% endif %}{% else %} null {% endif %};
    {% endfor %}
    
    {%if cols %}
    private {{name}} {% for col in cols %}{% if loop.first %}({% endif %}{{col.type}} {{col.name}}{% if loop.last %}){% else %}, {% endif %}{% endfor %}{
        {% for col in cols %}
        this.{{col.name}}={{col.name}};{% endfor %}
    }
    {% endif %}
    
}
`