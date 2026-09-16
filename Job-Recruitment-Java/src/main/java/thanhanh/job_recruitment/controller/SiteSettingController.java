package thanhanh.job_recruitment.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.domain.SiteSetting;
import thanhanh.job_recruitment.service.SiteSettingService;
import thanhanh.job_recruitment.util.annotation.ApiMessage;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/settings")
@AllArgsConstructor
public class SiteSettingController {

    private final SiteSettingService siteSettingService;

    @GetMapping
    @ApiMessage("Fetch all site settings")
    public ResponseEntity<Map<String, String>> getAllSettings() {
        return ResponseEntity.ok(this.siteSettingService.getAllAsMap());
    }

    @GetMapping("/{key}")
    @ApiMessage("Fetch a site setting by key")
    public ResponseEntity<SiteSetting> getSettingByKey(@PathVariable("key") String key) {
        SiteSetting setting = this.siteSettingService.getByKey(key);
        if (setting == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(setting);
    }

    @PutMapping("/{key}")
    @ApiMessage("Update a site setting by key")
    public ResponseEntity<SiteSetting> updateSetting(
            @PathVariable("key") String key,
            @RequestBody Map<String, String> body
    ) {
        String value = body.getOrDefault("value", "");
        String description = body.getOrDefault("description", key);
        SiteSetting updated = this.siteSettingService.update(key, value, description);
        return ResponseEntity.ok(updated);
    }

    @PostMapping
    @ApiMessage("Batch update site settings")
    public ResponseEntity<Map<String, String>> batchUpdateSettings(@RequestBody Map<String, String> settings) {
        this.siteSettingService.batchUpdate(settings);
        return ResponseEntity.ok(this.siteSettingService.getAllAsMap());
    }
}
