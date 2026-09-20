package thanhanh.job_recruitment.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        
        String cleanUrl = (url != null ? url.trim() : "");
        String cleanUsername = (username != null ? username.trim() : "");
        String cleanPassword = (password != null ? password.trim() : "");
        
        config.setJdbcUrl(cleanUrl);
        config.setUsername(cleanUsername);
        config.setPassword(cleanPassword);
        config.setDriverClassName(driverClassName != null ? driverClassName.trim() : "com.mysql.cj.jdbc.Driver");
        
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        config.setKeepaliveTime(300000);
        
        return new HikariDataSource(config);
    }
}
