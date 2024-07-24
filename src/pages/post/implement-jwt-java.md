---
layout: '../../layouts/BlogLayout.astro'
title: Implementar autenticación en Java (Spring Boot)
description: Aprende cómo configurar autenticación con Json Web Token en un proyecto Java (Spring Boot)
tag: [Tutorial, Java, Spring Boot, JWT, Seguridad, Backend]
date: 2024-07-05
---

## Introducción

En el mundo de las aplicaciones web, la seguridad es un aspecto fundamental que no se puede pasar por alto. La autenticación y la autorización son pilares esenciales para garantizar que solo los usuarios autorizados tengan acceso a los recursos críticos de nuestras aplicaciones. Una de las tecnologías más utilizadas y efectivas para manejar la autenticación es JSON Web Token (JWT). En este post, exploraremos cómo implementar JWT en una aplicación Java utilizando Spring Boot y Maven.

A través de este tutorial, aprenderás a integrar JWT en tu proyecto de manera sencilla y eficiente, reforzando la seguridad de tu aplicación. Utilizaremos Maven para gestionar las dependencias y construir nuestro proyecto, lo que facilitará su mantenimiento y escalabilidad. Cabe mencionar que esta es solo una de las muchas formas en las que se puede implementar la autenticación con JWT, pero es una de las más populares debido a su robustez y flexibilidad.

## Base de datos

Para poder identificar a los usuarios de nuestra aplicación tendremos que tener tablas donde buscar dichos usuarios. Además, en este caso, estos usuarios también podran cumplir una serie de roles por lo que tendremos que tener una tabla propia en la que almacenar dichos roles.

### Tabla de usuarios:

```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `password` varchar(45) COLLATE utf8mb3_spanish2_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
)
```

### Tabla de roles:

```sql
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(15) COLLATE utf8mb3_spanish2_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_UNIQUE` (`name`)
)
```

### Tabla de relación:

Esta tabla se crea a consecuencia de la relación muchos a muchos entre usuarios y roles.

```sql
/*Esta tabla representa la relación muchos a muchos entre usuarios y roles
(puede haber un usuario con muchos roles y un rol con muchos usuarios)*/
CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FK_roleID_idx` (`role_id`),
  CONSTRAINT `FK_roleID` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_userID` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
)
```

## Dependencias

Para implementar JWT en un proyecto Java con Spring Boot necesitaremos algunas dependencias mínimas en nuestro archivo pom.xml.

- Spring Web
- Spring Security
- Spring Data JPA
- MySQL Driver
- Lombok
- [Json Web Token](https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt-api)

## Configuración del proyecto

Lo primero que tendremos que hacer una vez que tengamos todas las dependencias correctamente instaladas en nuestro pom.xml será añadir la configuración de la base de datos al archivo application.properties para que JPA pueda conectarse

#### Configuración de application.properties:

```bash
spring.datasource.url=jdbc:mysql://localhost:3306/jwtDB
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

## Estructura de la aplicación

En este caso para implementar el sistema de autenticación con Json Web Token vamos a crear una carpeta llamada Security donde tendremos todos los archivos de configuración de seguridad de la aplicación y un sistema básico de capas estructurado en carpetas donde almacenaremos nuestros modelos, repositorios, servicios y controladores.

```
    📁com.example.jwtService
        📁security
         ├── SecurityConfig.java
         ├── JWTGenerator.java
         ├── JWTAuthenticationFilter.java
        📁models
         ├── UserModel.java
         ├── RoleModel.java
         ├── RegisterRequestModel.java
         ├── LoginRequestModel.java
         ├── AuthResponseModel.java
        📁repository
         ├── UserRepository.java
         ├── RoleRepository.java
        📁services
         ├── AuthService.java
         ├── UserService.java
        📁controllers
         ├── AuthController.java
         ├── UserController.java
```

## Código de la aplicación

- ### Modelos
  El modelo es una clase que representa entidades del dominio de la aplicación. Estas clases contienen atributos que corresponden a las propiedades de las entidades y pueden incluir lógica de negocio básica como validaciones.

#### UserModel.java

```bash
@Data
@Entity
@Table(name="users")
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name="user_roles", joinColumns = @JoinColumn(name="user_id", referencedColumnName = "id" ),
    inverseJoinColumns = @JoinColumn(name="role_id", referencedColumnName = "id"))
    private List<RoleModel> roles = new ArrayList<>();
}
```

#### RoleModel.java

```bash
@Data
@Entity
@Table(name="roles")
public class RoleModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    String name;
}
```

#### RegisterRequestModel.java

```bash
@Data
public class RegisterRequestModel {
    String username;
    String password;
}
```

#### LoginRequestModel.java

```bash
public class LoginRequestModel extends RegisterRequestModel {}
```

#### AuthResponseModel.java

```bash
@Data
public class AuthResponseModel {
    private String accesToken;
    private String tokenType = "Bearer ";
    private String username;
    public AuthResponse(String token){
        accesToken = token;
    }
}
```

- ### Repositorios
  El repositorio se encarga de la persistencia de los datos. Es la capa que maneja las operaciones de acceso a la base de datos. En nuestro caso, utilizaremos Spring Data JPA, que proporciona interfaces para interactuar con la base de datos.

#### UserRepository.java

```java
public interface UserRepository extends JpaRepository<UserModel, Integer> {
    Optional<UserModel> findByUsername(String username);
    Boolean existsByUsername(String username);
}
```

#### RoleRepository.java

```java
public interface RoleRepository extends JpaRepository<RoleModel, Integer>{
    Optional<RoleModel> findByName(String name);
}
```

####

- ### Servicios
  Un servicio contiene la lógica de negocio de la aplicación. Es una capa intermedia entre el controlador y el repositorio que realiza operaciones más complejas utilizando los métodos del repositorio. Los servicios permiten encapsular la lógica de negocio y reutilizarla en diferentes partes de la aplicación.

#### AuthService.java

```java
@Service
public class AuthService implements UserDetailsService{
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("No se ha encontrado al usuario"));
        return new User(user.getUsername(), user.getPassword(), mapRoles(user.getRoles()));
    }

    private Collection<GrantedAuthority> mapRoles(List<RoleModel> roles){
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
    }
}
```

#### UserService.java

```java
@Service
public class UserService{
    @Autowired
    private UserRepository userRepository;

    public List<UserModel>findAll(){
        return userRepository.findAll();
    }
}
```

- ### Controladores
  El controlador maneja las solicitudes HTTP, procesa la entrada del usuario, y devuelve respuestas HTTP. Es la capa que interactúa con el cliente (por ejemplo, un navegador web) y utiliza los servicios para realizar operaciones y obtener datos.

#### AuthController.java

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTGenerator jwtGenerator;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseModel> login(@RequestBody LoginRequestModel loginRequest){
        //Buscamos si el usuario existe y si la contraseña es correcta
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        //Generamos el JWT
        String token = jwtGenerator.generateToken(authentication);

        //Creamos la respuesta y la enviamos
        AuthResponseModel authResponse = new AuthResponseModel(token);
        authResponse.setUsername(loginRequest.getUsername());
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestModel registerRequest){
        //Comprobamos que el nombre de usuario no exista
        if(userRepository.existsByUsername(registerRequest.getUsername())){
            return new ResponseEntity<>("El usuario ya existe", HttpStatus.BAD_REQUEST);
        }

        //En caso de que no exista creamos un nuevo objeto de tipo usuario y lo almacenamos en la base de datos
        UserModel user = new UserModel();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        RoleModel roles = roleRepository.findByName("User").get();
        user.setRoles(Collections.singletonList(roles));
        userRepository.save(user);
        return new ResponseEntity<>("El usuario se ha creado con éxito", HttpStatus.CREATED);
    }
}
```

#### UserController.java

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping
    public List<UserModel> GetAllUsers(){
        return userService.findAll();

    }
}
```

- ### Configuración de seguridad

#### SecurityConfig.java

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private AuthService authService;

    //Creamos el filtro de seguridad y lo configuramos de manera que todas las rutas requieran de autenticación a excepción de las que estén bajo /api/auth/
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
            .csrf((csrf) -> csrf.disable())
            .authorizeHttpRequests((auth)->auth.requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults())
            .sessionManagement((session)->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
            http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JWTAuthenticationFilter jwtAuthenticationFilter(){
        return new JWTAuthenticationFilter();
    }
}
```

#### JWTGenerator.java

```java
@Component
public class JWTGenerator {
    //Creamos algunos parámetros del token (estos podrían ir en un archivo a parte o en variables de entorno)
    public final long JWT_EXPIRATION = 60000 * 60 * 10;
    public String JWTSECRET = "tuclavesecreta";

    public String generateToken(Authentication auth){
        String username = auth.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + JWT_EXPIRATION);

        String token = Jwts.builder()
            .subject(username)
            .issuedAt(currentDate)
            .expiration(expireDate)
            .signWith(getSigningKey())
            .compact();
        return token;
    }

        public String getSubjectFromToken(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();

        return claims.getSubject();
      }

      public boolean validateToken(String token) {
        try {
          Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token);
          return true;
        } catch (Exception e) {
          throw new AuthenticationCredentialsNotFoundException("El token ha expirado");
        }
      }

    public SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(JWTSECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

#### JWTAuthenticationFilter.java

```java
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JWTGenerator jwtGenerator;

    @Autowired
    private AuthService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {
       String token = getJWTFromRequest(request);
       if(StringUtils.hasText(token) && jwtGenerator.validateToken(token)){
        String username = jwtGenerator.getSubjectFromToken(token);

        UserDetails userDetails = authService.loadUserByUsername(username);
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            userDetails.getUsername(),
            null,
            userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
       }
       filterChain.doFilter(request, response);
    }

    private String getJWTFromRequest(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")){
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }

}
```
