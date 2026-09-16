package thanhanh.job_recruitment.service;

import thanhanh.job_recruitment.domain.SiteSetting;
import java.util.List;
import java.util.Map;

public interface SiteSettingService {
    SiteSetting getByKey(String key);
    List<SiteSetting> getAll();
    Map<String, String> getAllAsMap();
    SiteSetting update(String key, String value, String description);
    void batchUpdate(Map<String, String> settings);
}
