#version 430

in vec3 vertPos;
in vec3 N;
in vec3 lightPos;
/*TODO:: Complete your shader code for a full Phong shading*/ 

struct materialInfo{
	vec3 Kd;			//Material diffuse
	vec3 Ka;			//Material ambient
	vec3 Ks;			//Materiel specular
};
uniform materialInfo material;

struct lightInfo{
	vec3 Ld;			//Light diffuse
	vec3 La;			//Light ambient
	vec3 Ls;			//Light specular
	float attenlin;		//Linear attenuation factor
	float attenquad;	//Quadratic attenuation factor
	float attenconst;	//Constant attenuation factor
};
uniform lightInfo light;

uniform vec3 viewPos;		//camera position
uniform float specPwr;		//Specular power

// complete to a full phong shading
layout( location = 0 ) out vec4 FragColour;

//Calculate the diffuse element
vec4 diffuseElement(vec3 L) {
	//calculate Diffuse Light Intensity  
    vec4 Id = vec4(light.Ld,1.0) * max(dot(N,L), 0.0);
    Id = clamp(Id, 0.0, 1.0);  
   
	//Multiply the Reflectivity by the Diffuse intensity
	vec4 diffuse = vec4(material.Kd,1.0) * Id;

	return diffuse;
}

//Calculate the specular element
vec4 specularElement(vec3 V, vec3 R) {
	//Calculate Specular Element Intensity
	vec4 Is = vec4(light.Ls,1.0) * pow(max(dot(V,R), 0.0), specPwr);

	//Specular reflectivity
    vec4 specular = vec4(material.Ks,1.0) * Is;

	return specular;
}

//Calculate the ambient element
vec4 ambientElement() {
   //Ambient reflectivity
   vec4 ambient = vec4(material.Ka,1.0) * vec4(light.La, 0.0);

   return ambient;
}

//Calculate the attenuation element
float attenuationElement() {
vec3 distVec = lightPos - vertPos;

//Calculate the attenuation element
float atten = 1.0f / (light.attenconst + (light.attenlin * length(distVec)) + (light.attenquad * pow(length(distVec), 2)));

return atten;
}

//Main Code
void main() {
   //Calculate the light vector
   vec3 L = normalize(lightPos - vertPos);  
    
   //Calculate View and Reflect
   vec3 V = normalize(vertPos - viewPos);
   vec3 R = normalize(reflect(lightPos - vertPos, N));
	
   //Final Result
   FragColour = ambientElement() + (attenuationElement() * (diffuseElement(L) + specularElement(V, R)));
}

