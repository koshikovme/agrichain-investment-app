package com.agriculturalmarket.users.entity.accounts;

import com.agriculturalmarket.users.entity.BaseEntity;
import com.agriculturalmarket.users.entity.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Accounts extends BaseEntity {
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "account_number")
    @Id
    private Long accountNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private Role accountType;
}
