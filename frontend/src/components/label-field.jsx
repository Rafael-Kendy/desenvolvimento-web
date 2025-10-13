function LabelField({icon, name, label, type="text", size, value, onChange, required=false, placeholder}){
    return(
        <div className="form-field">
            <label>
                <i className={icon}></i>
                <span className="bold">  {label}:</span>

                <br/>

                {type==="area" ? (
                    <textarea name={name} value={value} onChange={onChange} required={required} rows={size || 4} placeholder={placeholder}/>
                ):(
                    <input name={name} type={type} value={type==="file" ? undefined:value} onChange={onChange} required={required} placeholder={placeholder}/>
                )}

            </label>
        </div>
    )
}

export default LabelField