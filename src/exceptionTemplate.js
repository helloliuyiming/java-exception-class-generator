export let template =
`
package {{config.package}};

public {%if final %} final {% endif %} class {{exceptionName}}{{config.suffix}} extends {{parentException}}{
    
    {% for field in fields %}
    private {{field.type}} {{field.field}}={%if field.value!==null %}{%if field.type==="String" %} "{% endif %}{{field.value}} {%if field.type==="String" %}"{% endif %}{% else %} null {% endif %} ;
    {% endfor %}
    
    public {{exceptionName}} (){
        super();
    }
    
    public {{exceptionName}} (String message){
        super(message);
    }
    
    public {{exceptionName}} (String message,{% for field in fields %} {%if loop.index>1 %} , {% endif %} {{field.type}} {{field.field}} {% endfor %}){
        super(message);
        {% for field in fields %}
        this.{{field.field}} = {{field.field}};
        {% endfor %}
    }
    
    {%if requireGetter %}
    {% for field in fields %} 
    public {%if field.final %} final {% endif %} {{field.type}} get{{field.field | capitalize}}(){
        return this.{{field.field}};
    }
    {% endfor %}
    {% endif %}
    
    {%if requireSetter %}
    {% for field in fields %} 
    public {%if field.final %} final {% endif %} void set{{field.field | capitalize}}({{field.type}} {{field.field}}){
        this.{{field.field}} = {{field.field}};
    }
    {% endfor %}
    {% endif %}
}
`